import { chromium } from 'playwright';

const baseUrl = 'https://yfh4yuhzmus6.space.minimax.io';

const pages = [
  { path: '/', name: 'Dashboard' },
  { path: '/pricing', name: 'Pricing Page' },
  { path: '/adjudicator', name: 'Adjudicator Insights (Premium)' },
  { path: '/post-approval', name: 'Post-Approval (Premium)' },
  { path: '/knowledge', name: 'Knowledge Base' }
];

async function testAllPages() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = [];
  
  for (const pageInfo of pages) {
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
      console.log(`\nTesting: ${pageInfo.name} (${pageInfo.path})`);
      await page.goto(`${baseUrl}${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      const pageContent = await page.content();
      const hasContent = pageContent.length > 1000;
      
      // Check for specific elements
      const hasLockIcon = pageContent.includes('lock') || pageContent.includes('Lock');
      const hasPricing = pageContent.includes('Premium') || pageContent.includes('pricing');
      const hasUpgrade = pageContent.includes('Upgrade') || pageContent.includes('upgrade');
      
      results.push({
        name: pageInfo.name,
        path: pageInfo.path,
        errors: errors,
        hasContent: hasContent,
        hasLockIcon,
        hasPricing,
        hasUpgrade,
        status: errors.length === 0 && hasContent ? '✅ PASS' : '❌ FAIL'
      });
      
      if (errors.length > 0) {
        console.log(`  ❌ Errors: ${errors.length}`);
        errors.forEach((err, i) => console.log(`     ${i + 1}. ${err.substring(0, 100)}...`));
      } else if (!hasContent) {
        console.log(`  ❌ No content found`);
      } else {
        console.log(`  ✅ No errors, content loaded`);
        if (hasLockIcon) console.log(`  🔒 Lock icons present`);
        if (hasPricing) console.log(`  💰 Premium/Pricing content found`);
        if (hasUpgrade) console.log(`  ⬆️ Upgrade CTA found`);
      }
      
    } catch (error) {
      console.log(`  ❌ Navigation error: ${error.message}`);
      results.push({
        name: pageInfo.name,
        path: pageInfo.path,
        errors: [error.message],
        hasContent: false,
        status: '❌ FAIL'
      });
    }
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY - Paywall System Test');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.status.includes('PASS')).length;
  const failed = results.filter(r => r.status.includes('FAIL')).length;
  
  results.forEach(r => {
    console.log(`${r.status} - ${r.name}`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${passed} passed, ${failed} failed out of ${results.length} pages`);
  console.log('='.repeat(60));
  
  if (failed > 0) {
    console.log('\nPages with errors need attention:');
    results.filter(r => r.status.includes('FAIL')).forEach(r => {
      console.log(`  - ${r.name}: ${r.errors.length} error(s)`);
    });
  }
}

testAllPages().catch(console.error);
