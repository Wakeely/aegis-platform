const { chromium } = require('playwright');

async function testWithAuth() {
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
  
  console.log('=== Setting up authentication in localStorage ===\n');
  
  // Set auth data in localStorage to simulate logged-in user
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('aegis-auth', JSON.stringify({
      isAuthenticated: true,
      user: {
        name: 'Alexandra Chen',
        email: 'alexandra.chen@email.com'
      }
    }));
    
    // Also set subscription data
    localStorage.setItem('aegis-subscription', JSON.stringify({
      plan: 'FREE',
      status: 'none',
      subscriptionId: null,
      currentPeriodEnd: null,
      features: {}
    }));
  });
  
  console.log('1. Testing /subscription with auth...');
  await page.goto(`${baseUrl}/subscription`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  console.log('   Current URL:', page.url());
  console.log('   Page title:', await page.title());
  const subContent = await page.content();
  console.log('   Has subscription text:', subContent.includes('Subscription') || subContent.includes('Premium'));
  console.log('   Body background color:', await page.evaluate(() => getComputedStyle(document.body).backgroundColor));
  
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

testWithAuth().catch(console.error);
