const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    // Check for key elements
    const title = await page.title();
    console.log('Page title:', title);
    
    const heroTitle = await page.textContent('.hero-title');
    console.log('Hero title found:', heroTitle ? 'Yes' : 'No');
    
    const features = await page.locator('.features-section').isVisible();
    console.log('Features section visible:', features);
    
    const howItWorks = await page.locator('.how-it-works-section').isVisible();
    console.log('How It Works section visible:', howItWorks);
    
    const testimonials = await page.locator('.testimonials-section').isVisible();
    console.log('Testimonials section visible:', testimonials);
    
    const stats = await page.locator('.stats-section').isVisible();
    console.log('Stats section visible:', stats);
    
    // Check for console errors
    if (errors.length > 0) {
      console.log('\nConsole errors found:');
      errors.forEach(err => console.log(' -', err));
    } else {
      console.log('\nNo console errors found!');
    }
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
