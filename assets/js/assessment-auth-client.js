const cfg = window.TAMAYUZ_AUTH_CONFIG || {};

export function authConfigured() {
  return Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
}

export async function createAuthClient() {
  if (!authConfigured()) throw new Error('TAMAYUZ_AUTH_NOT_CONFIGURED');
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  return createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

export function safeNext(raw) {
  const fallback = '/personality.html';
  if (!raw) return fallback;
  try {
    const u = new URL(raw, window.location.origin);
    if (u.origin !== window.location.origin) return fallback;
    return u.pathname + u.search + u.hash;
  } catch (_) {
    return fallback;
  }
}

export async function currentSession() {
  const client = await createAuthClient();
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return { client, session: data.session };
}
