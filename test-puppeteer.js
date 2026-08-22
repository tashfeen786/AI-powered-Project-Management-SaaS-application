const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  console.log("Navigating to app...");
  await page.goto('http://localhost:3001');
  
  // wait for it
  await new Promise(r => setTimeout(r, 2000));
  console.log("Done.");
  await browser.close();
})();
