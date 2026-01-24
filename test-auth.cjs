const { chromium } = require('playwright');

async function testAuthAndPages() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  const consoleMessages = [];
  const responses = [];
  
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });
  
  page.on('response', response => {
    if (response.url().includes('/subscription') || response.url().includes('/knowledge')) {
      responses.push({ url: response.url(), status: response.status() });
    }
  });
  
  const baseUrl = 'https://kijqk1hg3mtb.space.minimax.io';
  
  console.log('=== Testing WITHOUT authentication (fresh browser) ===\n');
  
  console.log('1. Going to /subscription...');
  await page.goto(`${baseUrl}/subscription`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  console.log('   Current URL:', page.url());
  console.log('   Page content includes signin:', (await page.content()).includes('signin') || (await page.content()).includes('Sign In'));
  
  console.log('\n2. Going to /knowledge...');
  await page.goto(`${baseUrl}/knowledge`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  console.log('   Current URL:', page.url());
  console.log('   Page content includes signin:', (await page.content()).includes('signin') || (await page.content()).includes('Sign In'));
  
  console.log('\n3. Going to /dashboard...');
  await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  console.log('   Current URL:', page.url());
  
  // Check if localStorage has auth data
  console.log('\n=== LocalStorage Check ===');
  const localStorage = await page.evaluate(() => JSON.stringify(localStorage));
  console.log('LocalStorage keys:', localStorage);
  
  console.log('\n=== Console Errors ===');
  errors.forEach(err => console.log('ERROR:', err));
  
  await browser.close();
}

testAuthAndPages().catch(console.error);
