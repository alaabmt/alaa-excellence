window.TAMAYUZ_AUTH_CONFIG = Object.freeze({
  provider: 'supabase',
  publicConfigEndpoint: 'https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/public-auth-config',
  loginPath: '/account/login.html',
  registerPath: '/account/register.html',
  accountPath: '/account/',
  protectedPrefixes: [
    '/tools/learning-preference-profile/',
    '/tools/work-approach-assessment/'
  ]
});
