import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://127.0.0.1:8000';
const browser = await chromium.launch({ headless: true });

async function checkViewport(name, viewport) {
  const page = await browser.newPage({ viewport, javaScriptEnabled: false });
  const failures = [];

  async function expectVisible(path, selectors) {
    const response = await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    if (!response || !response.ok()) failures.push(`${path}: HTTP ${response?.status()}`);
    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      if (!count) failures.push(`${path}: missing ${selector}`);
    }
  }

  await expectVisible('/account/register.html?lang=ar', [
    'input#name', 'input#email[type="email"]', 'input#password[type="password"]', 'button#submit'
  ]);
  if (await page.locator('input#username, label[for="username"], #usernameLabel').count()) {
    failures.push('/account/register.html: username field is still present');
  }

  await expectVisible('/account/login.html?lang=ar', [
    'input#email[type="email"]', 'input#password[type="password"]', 'button#submit'
  ]);
  if (await page.locator('input#username, label[for="username"]').count()) {
    failures.push('/account/login.html: username field is present');
  }

  await expectVisible('/account/index.html?lang=ar', ['#title', '#logout', '#history']);
  await expectVisible('/tools/learning-preference-profile/index.html', ['script[src="/assets/js/auth-config.js"]']);
  await expectVisible('/tools/work-approach-assessment/index.html', ['script[src="/assets/js/auth-config.js"]']);

  await page.close();
  if (failures.length) throw new Error(`${name} failures:\n${failures.join('\n')}`);
  console.log(`${name}: PASS`);
}

await checkViewport('desktop', { width: 1440, height: 1000 });
await checkViewport('mobile', { width: 390, height: 844 });

await browser.close();
console.log('Assessment auth browser smoke test: PASS');
