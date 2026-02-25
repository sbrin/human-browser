const { launchFreeman } = require('freeman-browser/scripts/browser-freeman');
const path = require('path');

async function run() {
  console.log('🚀 Launching Freeman Browser...');
  const { browser, page, humanClick, humanScroll, sleep } = await launchFreeman({ mobile: false });
  let targetPage = page;
  
  try {
    console.log('🌐 Navigating to https://ilin.pt/');
    await targetPage.goto('https://ilin.pt/', { waitUntil: 'domcontentloaded' });
    await sleep(2000);
    
    console.log('📜 Scrolling...');
    for (let i = 0; i < 3; i++) {
      await humanScroll(targetPage, 'down', 500);
      await sleep(1000);
    }
    
    console.log('🔍 Looking for Lopaka article link...');
    // We get all links mentioning 'lopaka'
    let articleHref = await targetPage.evaluate(() => {
       const links = Array.from(document.querySelectorAll('a[href*="lopaka"]'));
       return links.length > 0 ? links[0].href : null;
    });
    
    if (articleHref) {
      console.log(`🎉 Found link: ${articleHref}`);
      console.log('⏳ Navigating to article...');
      // Safe navigation
      await targetPage.goto(articleHref, { waitUntil: 'domcontentloaded' });
      await sleep(3000);
      
      console.log(`✅ Now at: ${targetPage.url()}`);
      
      // Keep going if we are not on lopaka.app yet
      if (!targetPage.url().includes('lopaka.app')) {
         console.log('🔍 Looking for outbound link to lopaka.app...');
         
         // Scroll a bit
         for (let i = 0; i < 2; i++) {
           await humanScroll(targetPage, 'down', 600);
           await sleep(1000);
         }
         
         let outboundHref = await targetPage.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href*="lopaka.app"]'));
            return links.length > 0 ? links[0].href : null;
         });
         
         if (outboundHref) {
            console.log(`🎉 Found outbound link: ${outboundHref}`);
            console.log('⏳ Navigating to lopaka.app...');
            await targetPage.goto(outboundHref, { waitUntil: 'domcontentloaded' });
            await sleep(3000);
         } else {
            console.log('❌ Could not find outbound link. Aborting.');
            return;
         }
      }
      
      console.log(`✅ Now at project site: ${targetPage.url()}`);
      
      console.log('🔍 Looking for the Pricing page link...');
      
      // Let's scroll a bit
      await humanScroll(targetPage, 'down', 300);
      await sleep(1000);
      
      let pricingHref = await targetPage.evaluate(() => {
          // Look by exact text or href
          const links = Array.from(document.querySelectorAll('a'));
          for (const a of links) {
             const text = (a.innerText || "").toLowerCase();
             const href = (a.href || "").toLowerCase();
             
             if (href.includes('pricing') || href.includes('buy_hobby') || text.includes('pricing') || text.includes('цены') || text.includes('subscribe')) {
                return a.href;
             }
          }
          return null;
      });
      
      if (pricingHref) {
          console.log(`🎉 Found Pricing link: ${pricingHref}`);
          console.log('⏳ Navigating to pricing...');
          
          await targetPage.goto(pricingHref, { waitUntil: 'domcontentloaded' });
          await sleep(5000);
          
          console.log(`✅ Now at Pricing page: ${targetPage.url()}`);
          
          // Let's scroll slightly
          await humanScroll(targetPage, 'down', 300);
          await sleep(1000);
          
          const screenshotPath = path.join(__dirname, 'lopaka_pricing.png');
          await targetPage.screenshot({ path: screenshotPath, fullPage: false });
          console.log(`📸 Screenshot saved to: ${screenshotPath}`);
      } else {
          console.log('❌ Could not find a Pricing link. Here are the links on the page:');
          const allLinks = await targetPage.evaluate(() => {
             return Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText || a.textContent, href: a.href }));
          });
          console.log(allLinks);
      }
      
    } else {
      console.log('❌ Could not find any Lopaka article link on the home page.');
    }
    
  } catch (err) {
    console.error('❌ Error during browsing:', err);
  } finally {
    console.log('🚪 Closing browser...');
    await browser.close();
  }
}

run();
