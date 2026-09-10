const cfg = window.TAMAYUZ_AUTH_CONFIG || {};
let resolvedConfig = null;

export function authConfigured() {
  return Boolean((cfg.supabaseUrl && cfg.supabaseAnonKey) || cfg.publicConfigEndpoint);
}

async function resolveConfig() {
  if (resolvedConfig) return resolvedConfig;
  if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
    resolvedConfig = { supabaseUrl: cfg.supabaseUrl, supabaseAnonKey: cfg.supabaseAnonKey };
    return resolvedConfig;
  }
  if (!cfg.publicConfigEndpoint) throw new Error('TAMAYUZ_AUTH_NOT_CONFIGURED');
  const response = await fetch(cfg.publicConfigEndpoint, { method: 'GET', mode: 'cors', credentials: 'omit' });
  if (!response.ok) throw new Error('TAMAYUZ_AUTH_CONFIG_UNAVAILABLE');
  const data = await response.json();
  if (!data.supabaseUrl || !data.supabaseAnonKey) throw new Error('TAMAYUZ_AUTH_CONFIG_INVALID');
  resolvedConfig = { supabaseUrl: data.supabaseUrl, supabaseAnonKey: data.supabaseAnonKey };
  return resolvedConfig;
}

export async function createAuthClient() {
  if (!authConfigured()) throw new Error('TAMAYUZ_AUTH_NOT_CONFIGURED');
  const resolved = await resolveConfig();
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  return createClient(resolved.supabaseUrl, resolved.supabaseAnonKey, {
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
