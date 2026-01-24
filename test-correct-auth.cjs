const { chromium } = require('playwright');

async function testWithCorrectAuth() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  const consoleMessages = [];
  
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });
  
  const baseUrl = 'https://kijqk1hg3mtb.space.minimax.io';
  
  console.log('=== Setting up authentication with correct localStorage key ===\n');
  
  // First go to the page to establish origin
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  
  // Set auth data in localStorage using the CORRECT key from AuthContext
  await page.evaluate(() => {
    const userData = {
      id: Date.now(),
      email: 'test@example.com',
      name: 'Alexandra Chen',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('aegis_user', JSON.stringify(userData));
    localStorage.setItem('aegis_token', 'mock_token_' + Date.now());
  });
  
  console.log('LocalStorage after setting:');
  console.log('  aegis_user:', localStorage.getItem('aegis_user'));
  console.log('  aegis_token:', localStorage.getItem('aegis_token'));
  
  console.log('\n1. Testing /subscription with auth...');
  await page.goto(`${baseUrl}/subscription`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  console.log('   Current URL:', page.url());
  console.log('   Page title:', await page.title());
  const subContent = await page.content();
  console.log('   Has subscription text:', subContent.includes('Subscription') || subContent.includes('Premium'));
  console.log('   Body text preview:', subContent.substring(0, 500));
  
  console.log('\n2. Testing /knowledge with auth...');
  await page.goto(`${baseUrl}/knowledge`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  console.log('   Current URL:', page.url());
  console.log('   Page title:', await page.title());
  const knowledgeContent = await page.content();
  console.log('   Has knowledge text:', knowledgeContent.includes('Knowledge') || knowledgeContent.includes('Guide'));
  
  console.log('\n3. Testing /dashboard with auth...');
  await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  console.log('   Current URL:', page.url());
  console.log('   Page title:', await page.title());
  
  console.log('\n=== Console Errors ===');
  errors.forEach(err => console.log('ERROR:', err));
  
  if (errors.length === 0) {
    console.log('No errors found!');
  }
  
  await browser.close();
}

testWithCorrectAuth().catch(console.error);
