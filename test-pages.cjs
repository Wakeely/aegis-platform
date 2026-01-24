const { chromium } = require('playwright');

async function testPages() {
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
  
  console.log('Testing subscription page...');
  try {
    await page.goto(`${baseUrl}/subscription`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for any redirects/rendering
    const content = await page.content();
    console.log('Page title:', await page.title());
    console.log('Page has content:', content.length > 0);
    console.log('Has root div:', content.includes('id="root"'));
  } catch (e) {
    console.log('Subscription page error:', e.message);
  }
  
  console.log('\nTesting knowledge page...');
  try {
    await page.goto(`${baseUrl}/knowledge`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for any redirects/rendering
    const content = await page.content();
    console.log('Page title:', await page.title());
    console.log('Page has content:', content.length > 0);
    console.log('Has root div:', content.includes('id="root"'));
  } catch (e) {
    console.log('Knowledge page error:', e.message);
  }
  
  console.log('\n=== Console Errors ===');
  if (errors.length === 0) {
    console.log('No console errors found!');
  } else {
    errors.forEach(err => console.log('ERROR:', err));
  }
  
  console.log('\n=== All Console Messages ===');
  consoleMessages.forEach(msg => console.log(`[${msg.type}]`, msg.text));
  
  await browser.close();
}

testPages().catch(console.error);
