const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const url = 'https://v1pyhfy85idu.space.minimax.io';
  console.log('Testing:', url);
  
  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  
  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Page loaded successfully');
    
    // Wait a bit for any dynamic content
    await page.waitForTimeout(2000);
    
    // Check page title
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Check for main content
    const mainContent = await page.$('body');
    if (mainContent) {
      console.log('✅ Main content found');
    }
    
    // Check for navigation/sidebar
    const sidebar = await page.$('.sidebar, [class*="sidebar"]');
    if (sidebar) {
      console.log('✅ Sidebar found');
    } else {
      console.log('⚠️  Sidebar not detected');
    }
    
    // Report console errors
    if (consoleMessages.length > 0) {
      console.log('\n❌ Console Errors:');
      consoleMessages.forEach(msg => console.log('  ', msg));
    } else {
      console.log('✅ No console errors detected');
    }
    
    // Report page errors
    if (pageErrors.length > 0) {
      console.log('\n❌ Page Errors:');
      pageErrors.forEach(err => console.log('  ', err));
    } else {
      console.log('✅ No page errors detected');
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Error loading page:', error.message);
  }
  
  await browser.close();
})();
