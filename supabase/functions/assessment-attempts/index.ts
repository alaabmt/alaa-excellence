import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigin = "https://tamayuz10x.com";
const allowedKeys = new Set(["learning-preference-profile", "work-approach-assessment"]);

function headers() {
  return {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": allowedOrigin,
    "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
    "access-control-allow-methods": "GET,POST,PATCH,OPTIONS",
    "vary": "Origin"
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: headers() });
  const origin = req.headers.get("origin");
  if (origin && origin !== allowedOrigin) {
    return new Response(JSON.stringify({ error: "origin_not_allowed" }), { status: 403, headers: headers() });
  }

  const url = Deno.env.get("SUPABASE_URL") || "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const auth = req.headers.get("authorization") || "";
  if (!url || !anonKey || !auth) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: headers() });
  }

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: headers() });
  }
  const userId = userData.user.id;

  try {
    if (req.method === "GET") {
      const requestUrl = new URL(req.url);
      const key = requestUrl.searchParams.get("assessment_key");
      let query = supabase
        .from("assessment_attempts")
        .select("id,assessment_key,started_at,completed_at,status,result_json,created_at,updated_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (key) {
        if (!allowedKeys.has(key)) {
          return new Response(JSON.stringify({ error: "invalid_assessment_key" }), { status: 400, headers: headers() });
        }
        query = query.eq("assessment_key", key);
      }
      const { data, error } = await query;
      if (error) throw error;
      return new Response(JSON.stringify({ attempts: data }), { headers: headers() });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const key = String(body?.assessment_key || "");
      if (!allowedKeys.has(key)) {
        return new Response(JSON.stringify({ error: "invalid_assessment_key" }), { status: 400, headers: headers() });
      }
      const { data, error } = await supabase
        .from("assessment_attempts")
        .insert({ user_id: userId, assessment_key: key, status: "in_progress" })
        .select("id,assessment_key,started_at,status")
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ attempt: data }), { status: 201, headers: headers() });
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const id = String(body?.id || "");
      const status = String(body?.status || "completed");
      if (!id || !["in_progress", "completed", "abandoned"].includes(status)) {
        return new Response(JSON.stringify({ error: "invalid_request" }), { status: 400, headers: headers() });
      }

      const { data: current, error: currentError } = await supabase
        .from("assessment_attempts")
        .select("id,assessment_key,started_at,status")
        .eq("id", id)
        .eq("user_id", userId)
        .maybeSingle();
      if (currentError) throw currentError;
      if (!current) {
        return new Response(JSON.stringify({ error: "attempt_not_found" }), { status: 404, headers: headers() });
      }

      if (status === "completed" && Object.prototype.hasOwnProperty.call(body, "result_json")) {
        const resultCompletedAt = String(body?.result_json?.completedAt || "");
        const startedAtMs = Date.parse(String(current.started_at || ""));
        const completedAtMs = Date.parse(resultCompletedAt);

        if (Number.isFinite(startedAtMs) && Number.isFinite(completedAtMs) && completedAtMs < startedAtMs) {
          return new Response(JSON.stringify({ error: "stale_result" }), { status: 409, headers: headers() });
        }

        if (resultCompletedAt) {
          const { data: duplicate, error: duplicateError } = await supabase
            .from("assessment_attempts")
            .select("id")
            .eq("user_id", userId)
            .eq("assessment_key", current.assessment_key)
            .eq("status", "completed")
            .eq("result_json->>completedAt", resultCompletedAt)
            .neq("id", id)
            .limit(1)
            .maybeSingle();
          if (duplicateError) throw duplicateError;
          if (duplicate?.id) {
            return new Response(JSON.stringify({ error: "duplicate_result" }), { status: 409, headers: headers() });
          }
        }
      }

      const patch: Record<string, unknown> = { status };
      if (status === "completed") patch.completed_at = new Date().toISOString();
      if (Object.prototype.hasOwnProperty.call(body, "result_json")) patch.result_json = body.result_json;

      const { data, error } = await supabase
        .from("assessment_attempts")
        .update(patch)
        .eq("id", id)
        .eq("user_id", userId)
        .select("id,assessment_key,started_at,completed_at,status,result_json")
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ attempt: data }), { headers: headers() });
    }

    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: headers() });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "request_failed" }), { status: 500, headers: headers() });
  }
});
