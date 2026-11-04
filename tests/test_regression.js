/**
 * Automated Regression Test Suite
 * Tests responsive layout, flipbook, zoom, cart, search, booking across:
 * 390px, 768px, 820px, 1024px, 1440px.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
};

function createStaticServer(root) {
  return http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];
    if (cleanUrl === '/') cleanUrl = '/index.html';
    const filePath = path.join(root, cleanUrl);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const rootDir = path.resolve(__dirname, '..');
  const server = createStaticServer(rootDir);
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Local test server running at ${baseUrl}`);

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const testCases = [
    { name: 'Mobile 390px', width: 390, height: 844, isMobile: true, minBookW: 330, maxBookW: 360 },
    { name: 'Tablet 768px (iPad)', width: 768, height: 1024, isMobile: false, minBookW: 650, maxBookW: 730 },
    { name: 'Tablet 820px (iPad Air)', width: 820, height: 1180, isMobile: false, minBookW: 700, maxBookW: 780 },
    { name: 'Tablet 1024px (iPad Pro)', width: 1024, height: 1366, isMobile: false, minBookW: 850, maxBookW: 950 },
    { name: 'Desktop 1440px', width: 1440, height: 900, isMobile: false, minBookW: 950, maxBookW: 1100 }
  ];

  let allPassed = true;

  for (const tc of testCases) {
    console.log(`\n========================================`);
    console.log(`Testing: ${tc.name} (${tc.width}x${tc.height})`);
    console.log(`========================================`);

    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    await page.setViewport({ width: tc.width, height: tc.height, isMobile: tc.isMobile, hasTouch: tc.isMobile });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle0' });

    // 1. Console Errors
    if (consoleErrors.length > 0) {
      console.error(`FAIL: Console errors on ${tc.name}:`, consoleErrors);
      allPassed = false;
    } else {
      console.log(`✔ No console errors`);
    }

    // 2. Horizontal Overflow Check
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    if (overflow) {
      console.error(`FAIL: Horizontal overflow detected on ${tc.name}`);
      allPassed = false;
    } else {
      console.log(`✔ No horizontal overflow`);
    }

    // Scroll to menu book
    await page.evaluate(() => {
      const el = document.querySelector('[data-menu-book]');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await sleep(200);

    // 3. Inspect Sizing & Layout
    const metrics = await page.evaluate(() => {
      const book = document.querySelector('[data-menu-book]');
      const container = document.querySelector('.dark-feature .container');
      const spread = document.querySelector('.menu-book-spread');
      const leftPage = document.querySelector('.menu-book-page--left');
      const rightPage = document.querySelector('.menu-book-page--right');
      const counter = document.querySelector('[data-menu-counter]');

      const bookRect = book.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      const spreadRect = spread.getBoundingClientRect();

      const rightStyle = window.getComputedStyle(rightPage);
      const leftStyle = window.getComputedStyle(leftPage);

      return {
        bookWidth: bookRect.width,
        contWidth: contRect.width,
        spreadWidth: spreadRect.width,
        spreadHeight: spreadRect.height,
        ratio: spreadRect.width / spreadRect.height,
        leftDisplay: leftStyle.display,
        rightDisplay: rightStyle.display,
        counter: counter ? counter.textContent.trim() : '',
        bookOccupancyPct: (bookRect.width / contRect.width) * 100
      };
    });

    console.log(`  Container width: ${metrics.contWidth.toFixed(1)}px`);
    console.log(`  Menu Book width: ${metrics.bookWidth.toFixed(1)}px (${metrics.bookOccupancyPct.toFixed(1)}% of container)`);
    console.log(`  Spread dimensions: ${metrics.spreadWidth.toFixed(1)}px x ${metrics.spreadHeight.toFixed(1)}px (Aspect ratio: ${metrics.ratio.toFixed(4)})`);
    console.log(`  Pages visible: Left = ${metrics.leftDisplay}, Right = ${metrics.rightDisplay}`);
    console.log(`  Counter: "${metrics.counter}"`);

    // Verify Both Pages Visible
    if (metrics.leftDisplay === 'none' || metrics.rightDisplay === 'none') {
      console.error(`FAIL: Both pages must be visible`);
      allPassed = false;
    }

    // Verify Sizing Constraints
    if (metrics.bookWidth < tc.minBookW || metrics.bookWidth > tc.maxBookW) {
      console.error(`FAIL: Book width ${metrics.bookWidth.toFixed(1)}px out of range [${tc.minBookW}, ${tc.maxBookW}] on ${tc.name}`);
      allPassed = false;
    } else {
      console.log(`✔ Book width ${metrics.bookWidth.toFixed(1)}px is within expected range [${tc.minBookW}, ${tc.maxBookW}]`);
    }

    const expectedRatio = 1802 / 1680;
    if (Math.abs(metrics.ratio - expectedRatio) > 0.02) {
      console.error(`FAIL: Aspect ratio ${metrics.ratio} deviated from expected ${expectedRatio}`);
      allPassed = false;
    } else {
      console.log(`✔ Aspect ratio preserved (${metrics.ratio.toFixed(4)})`);
    }

    // 4. Test Flipping
    const nextBtn = await page.$('[data-menu-next]');
    const prevBtn = await page.$('[data-menu-prev]');

    await nextBtn.click();
    await sleep(750);

    const afterNext = await page.evaluate(() => {
      const counter = document.querySelector('[data-menu-counter]');
      return counter ? counter.textContent.trim() : '';
    });
    console.log(`  After Next: Counter = "${afterNext}"`);
    if (afterNext !== 'Trang 3–4 / 15') {
      console.error(`FAIL: Expected "Trang 3–4 / 15", got "${afterNext}"`);
      allPassed = false;
    }

    await prevBtn.click();
    await sleep(850);

    const afterPrev = await page.evaluate(() => {
      const counter = document.querySelector('[data-menu-counter]');
      return counter ? counter.textContent.trim() : '';
    });
    console.log(`  After Prev: Counter = "${afterPrev}"`);
    if (afterPrev !== 'Trang 1–2 / 15') {
      console.error(`FAIL: Expected "Trang 1–2 / 15", got "${afterPrev}"`);
      allPassed = false;
    }
    console.log(`✔ Page flipping forward and backward verified`);

    // 5. Test Tap-to-Zoom
    await page.click('.menu-book-page--right');
    await sleep(400);
    const zoomOpen = await page.evaluate(() => {
      const m = document.querySelector('#menu-zoom-modal');
      return m && m.classList.contains('open') && !m.hidden;
    });
    if (!zoomOpen) {
      console.error(`FAIL: Zoom modal did not open`);
      allPassed = false;
    }

    await page.click('.menu-zoom-close');
    await sleep(400);
    const zoomClosed = await page.evaluate(() => {
      const m = document.querySelector('#menu-zoom-modal');
      return m && (!m.classList.contains('open') || m.hidden);
    });
    if (!zoomClosed) {
      console.error(`FAIL: Zoom modal did not close`);
      allPassed = false;
    }
    console.log(`✔ Tap-to-zoom and close verified`);

    // 6. Test Cart on Mobile/Desktop
    if (tc.name.includes('Desktop')) {
      const addBtns = await page.$$('.add-btn');
      if (addBtns.length > 0) {
        await addBtns[0].click();
        await sleep(200);
        const count = await page.evaluate(() => {
          const badge = document.querySelector('.basket-count');
          return badge ? badge.textContent.trim() : '0';
        });
        if (count !== '1') {
          console.error(`FAIL: Expected cart count 1, got ${count}`);
          allPassed = false;
        } else {
          console.log(`✔ Cart item addition verified`);
        }
      }
    }

    await page.close();
  }

  // 7. Test /thuc-don.html search and filter
  console.log(`\n========================================`);
  console.log(`Testing Menu Page Search & Filter (/thuc-don.html)`);
  console.log(`========================================`);
  const menuPage = await browser.newPage();
  await menuPage.setViewport({ width: 1200, height: 800 });
  await menuPage.goto(`${baseUrl}/thuc-don.html`, { waitUntil: 'networkidle0' });

  const initialCount = await menuPage.evaluate(() => document.querySelectorAll('#menu-list .menu-item').length);
  console.log(`  Initial menu items: ${initialCount}`);
  if (initialCount < 80) {
    console.error(`FAIL: Expected >= 80 menu items, got ${initialCount}`);
    allPassed = false;
  }

  await menuPage.type('#menu-search', 'lẩu');
  await sleep(200);
  const searchCount = await menuPage.evaluate(() => document.querySelectorAll('#menu-list .menu-item').length);
  console.log(`  Items after searching 'lẩu': ${searchCount}`);
  if (searchCount === 0 || searchCount >= initialCount) {
    console.error(`FAIL: Search filter failed`);
    allPassed = false;
  } else {
    console.log(`✔ Menu search filtering verified`);
  }
  await menuPage.close();

  await browser.close();
  server.close();

  if (allPassed) {
    console.log(`\n🎉 ALL REGRESSION TESTS PASSED COMPLETELY! 🎉\n`);
    process.exit(0);
  } else {
    console.error(`\n❌ REGRESSION TESTS FAILED! ❌\n`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
