window.TAMAYUZ_AUTH_CONFIG = Object.freeze({
  provider: 'supabase',
  publicConfigEndpoint: 'https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/public-auth-config',
  protectedContentEndpoint: 'https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/assessment-content',
  attemptsEndpoint: 'https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/assessment-attempts',
  reportsEndpoint: 'https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/assessment-reports',
  reportEmailEndpoint: '',
  loginPath: '/account/login.html',
  registerPath: '/account/register.html',
  accountPath: '/account/',
  protectedPrefixes: [
    '/tools/learning-preference-profile/',
    '/tools/work-approach-assessment/'
  ]
});
