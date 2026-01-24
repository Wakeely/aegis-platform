const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  
  const baseUrl = 'https://kijqk1hg3mtb.space.minimax.io';
  
  // Add localStorage modification BEFORE navigation
  await page.addInitScript(() => {
    const userData = {
      id: Date.now(),
      email: 'test@example.com',
      name: 'Alexandra Chen',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('aegis_user', JSON.stringify(userData));
    localStorage.setItem('aegis_token', 'mock_token_' + Date.now());
  });
  
  console.log('Testing /subscription with auth...');
  await page.goto(`${baseUrl}/subscription`, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Has Subscription text:', bodyText.includes('Subscription') || bodyText.includes('Premium'));
  console.log('Body preview:', bodyText.substring(0, 200));
  
  console.log('\nTesting /knowledge with auth...');
  await page.goto(`${baseUrl}/knowledge`, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  
  const kbText = await page.evaluate(() => document.body.innerText);
  console.log('Has Knowledge text:', kbText.includes('Knowledge') || kbText.includes('Guide'));
  
  console.log('\n=== Errors ===');
  console.log(errors.length === 0 ? 'No errors!' : errors.join('\n'));
  
  await browser.close();
})();
