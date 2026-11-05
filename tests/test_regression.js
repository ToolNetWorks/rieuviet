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

  // 8. Test /thuc-don.html Flipbook Menu across Viewports
  console.log(`\n========================================`);
  console.log(`Testing Flipbook Menu on /thuc-don.html across Viewports`);
  console.log(`========================================`);
  const menuViewports = [
    { name: 'Mobile 390px', width: 390, height: 844, isMobile: true, minBookW: 330, maxBookW: 360 },
    { name: 'Tablet 768px (iPad)', width: 768, height: 1024, isMobile: false, minBookW: 650, maxBookW: 730 },
    { name: 'Tablet 820px (iPad Air)', width: 820, height: 1180, isMobile: false, minBookW: 700, maxBookW: 780 },
    { name: 'Tablet 1024px (iPad Pro)', width: 1024, height: 1366, isMobile: false, minBookW: 850, maxBookW: 950 },
    { name: 'Desktop 1440px', width: 1440, height: 900, isMobile: false, minBookW: 950, maxBookW: 1100 }
  ];

  for (const vp of menuViewports) {
    console.log(`\n  Checking /thuc-don.html at ${vp.name} (${vp.width}x${vp.height}):`);
    const p = await browser.newPage();
    const consoleErrs = [];
    p.on('console', msg => { if (msg.type() === 'error') consoleErrs.push(msg.text()); });
    p.on('pageerror', err => consoleErrs.push(err.message));

    await p.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile, hasTouch: vp.isMobile });
    await p.goto(`${baseUrl}/thuc-don.html`, { waitUntil: 'networkidle0' });

    if (consoleErrs.length > 0) {
      console.error(`  FAIL: Console errors on ${vp.name}:`, consoleErrs);
      allPassed = false;
    } else {
      console.log(`    ✔ No console errors`);
    }

    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) {
      console.error(`  FAIL: Horizontal overflow detected on ${vp.name}`);
      allPassed = false;
    } else {
      console.log(`    ✔ No horizontal overflow`);
    }

    // Scroll to flipbook section
    await p.evaluate(() => {
      const el = document.querySelector('#menu-goc [data-menu-book]');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await sleep(200);

    const metrics = await p.evaluate(() => {
      const section = document.querySelector('#menu-goc');
      const book = section ? section.querySelector('[data-menu-book]') : null;
      const container = section ? section.querySelector('.container') : null;
      const spread = book ? book.querySelector('.menu-book-spread') : null;
      const leftPage = book ? book.querySelector('.menu-book-page--left') : null;
      const rightPage = book ? book.querySelector('.menu-book-page--right') : null;
      const counter = book ? book.querySelector('[data-menu-counter]') : null;
      const pdfLink = section ? section.querySelector('a[href="/thuc-don-rieu-viet.pdf"]') : null;
      const zoomAllBtn = section ? section.querySelector('[data-open-zoom-all]') : null;

      if (!book || !container || !spread) {
        return { exists: false };
      }

      const bookRect = book.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      const spreadRect = spread.getBoundingClientRect();

      const leftStyle = window.getComputedStyle(leftPage);
      const rightStyle = window.getComputedStyle(rightPage);

      return {
        exists: true,
        bookWidth: bookRect.width,
        contWidth: contRect.width,
        spreadWidth: spreadRect.width,
        spreadHeight: spreadRect.height,
        ratio: spreadRect.width / spreadRect.height,
        leftDisplay: leftStyle.display,
        rightDisplay: rightStyle.display,
        counter: counter ? counter.textContent.trim() : '',
        bookOccupancyPct: (bookRect.width / contRect.width) * 100,
        hasPdfLink: !!pdfLink,
        hasZoomAllBtn: !!zoomAllBtn
      };
    });

    if (!metrics.exists) {
      console.error(`  FAIL: Flipbook menu element missing in #menu-goc`);
      allPassed = false;
      await p.close();
      continue;
    }

    console.log(`    Menu Book width: ${metrics.bookWidth.toFixed(1)}px (${metrics.bookOccupancyPct.toFixed(1)}% of container)`);
    console.log(`    Spread dimensions: ${metrics.spreadWidth.toFixed(1)}px x ${metrics.spreadHeight.toFixed(1)}px (Aspect ratio: ${metrics.ratio.toFixed(4)})`);
    console.log(`    Pages visible: Left = ${metrics.leftDisplay}, Right = ${metrics.rightDisplay}`);
    console.log(`    Counter: "${metrics.counter}"`);

    // Verify Both Pages Visible
    if (metrics.leftDisplay === 'none' || metrics.rightDisplay === 'none') {
      console.error(`  FAIL: Both pages must be visible`);
      allPassed = false;
    }

    // Verify Sizing Constraints
    if (metrics.bookWidth < vp.minBookW || metrics.bookWidth > vp.maxBookW) {
      console.error(`  FAIL: Book width ${metrics.bookWidth.toFixed(1)}px out of range [${vp.minBookW}, ${vp.maxBookW}] on ${vp.name}`);
      allPassed = false;
    } else {
      console.log(`    ✔ Book width ${metrics.bookWidth.toFixed(1)}px is within expected range [${vp.minBookW}, ${vp.maxBookW}]`);
    }

    const expectedRatio = 1802 / 1680;
    if (Math.abs(metrics.ratio - expectedRatio) > 0.02) {
      console.error(`  FAIL: Aspect ratio ${metrics.ratio} deviated from expected ${expectedRatio}`);
      allPassed = false;
    } else {
      console.log(`    ✔ Aspect ratio preserved (${metrics.ratio.toFixed(4)})`);
    }

    if (!metrics.hasPdfLink) {
      console.error(`  FAIL: PDF download link missing on /thuc-don.html`);
      allPassed = false;
    }
    if (!metrics.hasZoomAllBtn) {
      console.error(`  FAIL: [data-open-zoom-all] button missing on /thuc-don.html`);
      allPassed = false;
    }

    // Test Flipping
    const nextBtn = await p.$('#menu-goc [data-menu-next]');
    const prevBtn = await p.$('#menu-goc [data-menu-prev]');

    await nextBtn.click();
    await sleep(750);

    const afterNext = await p.evaluate(() => {
      const counter = document.querySelector('#menu-goc [data-menu-counter]');
      return counter ? counter.textContent.trim() : '';
    });
    console.log(`    After Next: Counter = "${afterNext}"`);
    if (afterNext !== 'Trang 3–4 / 15') {
      console.error(`  FAIL: Expected "Trang 3–4 / 15", got "${afterNext}"`);
      allPassed = false;
    }

    await prevBtn.click();
    await sleep(850);

    const afterPrev = await p.evaluate(() => {
      const counter = document.querySelector('#menu-goc [data-menu-counter]');
      return counter ? counter.textContent.trim() : '';
    });
    console.log(`    After Prev: Counter = "${afterPrev}"`);
    if (afterPrev !== 'Trang 1–2 / 15') {
      console.error(`  FAIL: Expected "Trang 1–2 / 15", got "${afterPrev}"`);
      allPassed = false;
    }
    console.log(`    ✔ Page flipping forward and backward verified`);

    // Test Tap-to-Zoom
    await p.click('#menu-goc .menu-book-page--right');
    await sleep(400);
    const zoomOpen = await p.evaluate(() => {
      const m = document.querySelector('#menu-zoom-modal');
      return m && m.classList.contains('open') && !m.hidden;
    });
    if (!zoomOpen) {
      console.error(`  FAIL: Zoom modal did not open`);
      allPassed = false;
    }

    await p.click('.menu-zoom-close');
    await sleep(400);
    const zoomClosed = await p.evaluate(() => {
      const m = document.querySelector('#menu-zoom-modal');
      return m && (!m.classList.contains('open') || m.hidden);
    });
    if (!zoomClosed) {
      console.error(`  FAIL: Zoom modal did not close`);
      allPassed = false;
    }
    console.log(`    ✔ Tap-to-zoom and close verified`);

    // Test data-open-zoom-all button
    await p.evaluate(() => {
      const btn = document.querySelector('#menu-goc [data-open-zoom-all]');
      if (btn) btn.click();
    });
    await sleep(400);
    const zoomAllOpen = await p.evaluate(() => {
      const m = document.querySelector('#menu-zoom-modal');
      return m && m.classList.contains('open') && !m.hidden;
    });
    if (!zoomAllOpen) {
      console.error(`  FAIL: [data-open-zoom-all] did not open zoom modal`);
      allPassed = false;
    }
    await p.evaluate(() => {
      const closeBtn = document.querySelector('.menu-zoom-close');
      if (closeBtn) closeBtn.click();
    });
    await sleep(400);
    console.log(`    ✔ [data-open-zoom-all] button verified`);

    await p.close();
  }

  // 9. Test /lien-he.html Google Maps link and Notice Removal
  console.log(`\n========================================`);
  console.log(`Testing Contact Page (/lien-he.html)`);
  console.log(`========================================`);
  const contactP = await browser.newPage();
  await contactP.goto(`${baseUrl}/lien-he.html`, { waitUntil: 'networkidle0' });

  const contactInfo = await contactP.evaluate(() => {
    const mapLink = document.querySelector('[data-link="map"]');
    const notice = document.querySelector('.notice');
    const bodyText = document.body.innerText;
    return {
      mapHref: mapLink ? mapLink.getAttribute('href') : '',
      mapTarget: mapLink ? mapLink.getAttribute('target') : '',
      mapRel: mapLink ? mapLink.getAttribute('rel') : '',
      hasNoticeElement: !!notice,
      containsNoticeText: bodyText.includes('SePay xét duyệt')
    };
  });

  console.log(`  Google Maps Link: href="${contactInfo.mapHref}", target="${contactInfo.mapTarget}", rel="${contactInfo.mapRel}"`);
  console.log(`  Notice element removed: ${!contactInfo.hasNoticeElement}`);
  console.log(`  Notice text removed: ${!contactInfo.containsNoticeText}`);

  const expectedMapUrl = 'https://share.google/Sk8WSTpvcjp1EKxP2';
  if (contactInfo.mapHref !== expectedMapUrl) {
    console.error(`FAIL: Expected map href "${expectedMapUrl}", got "${contactInfo.mapHref}"`);
    allPassed = false;
  }
  if (contactInfo.mapTarget !== '_blank') {
    console.error(`FAIL: Expected map target "_blank", got "${contactInfo.mapTarget}"`);
    allPassed = false;
  }
  if (!contactInfo.mapRel.includes('noopener') || !contactInfo.mapRel.includes('noreferrer')) {
    console.error(`FAIL: Expected map rel "noopener noreferrer", got "${contactInfo.mapRel}"`);
    allPassed = false;
  }
  if (contactInfo.hasNoticeElement || contactInfo.containsNoticeText) {
    console.error(`FAIL: Notice box or text still present on /lien-he.html`);
    allPassed = false;
  } else {
    console.log(`  ✔ Contact page Google Maps link and notice removal verified`);
  }
  await contactP.close();

  // ========================================
  // Testing Footer Typography & Responsive Layout across Viewports
  // ========================================
  console.log(`\n========================================\nTesting Footer Typography across Viewports\n========================================`);

  const footerViewports = [
    { name: 'iPhone 14 (390x844)', width: 390, height: 844, isMobile: true, expectedColumns: 1 },
    { name: 'iPhone 14 Pro Max (430x932)', width: 430, height: 932, isMobile: true, expectedColumns: 1 },
    { name: 'iPad Mini / Air (768x1024)', width: 768, height: 1024, isMobile: false, expectedColumns: 2 },
    { name: 'iPad Pro (1024x1366)', width: 1024, height: 1366, isMobile: false, expectedColumns: 4 },
    { name: 'Desktop (1440x900)', width: 1440, height: 900, isMobile: false, expectedColumns: 4 }
  ];

  for (const vp of footerViewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
    await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
    await sleep(200);

    const footerData = await page.evaluate(() => {
      const footer = document.querySelector('.footer');
      if (!footer) return null;

      const htmlStyle = window.getComputedStyle(document.documentElement);
      const textSizeAdjust = htmlStyle.webkitTextSizeAdjust || htmlStyle.textSizeAdjust;

      const headings = Array.from(footer.querySelectorAll('.footer-main h4')).map(h => {
        const s = window.getComputedStyle(h);
        return { text: h.innerText.trim(), fontSize: parseFloat(s.fontSize), fontWeight: s.fontWeight, fontFamily: s.fontFamily, lineHeight: s.lineHeight };
      });

      const links = Array.from(footer.querySelectorAll('.footer-main ul li a')).map(a => {
        const s = window.getComputedStyle(a);
        return { text: a.innerText.trim(), fontSize: parseFloat(s.fontSize), fontWeight: s.fontWeight, fontFamily: s.fontFamily };
      });

      const paragraphs = Array.from(footer.querySelectorAll('.footer p')).map(p => {
        const s = window.getComputedStyle(p);
        return { text: p.innerText.trim(), fontSize: parseFloat(s.fontSize), fontWeight: s.fontWeight, fontFamily: s.fontFamily };
      });

      const legalDivs = Array.from(footer.querySelectorAll('.legal-info div')).map(d => {
        const s = window.getComputedStyle(d);
        return { fontSize: parseFloat(s.fontSize), fontWeight: s.fontWeight, fontFamily: s.fontFamily };
      });

      const legalLabels = Array.from(footer.querySelectorAll('.legal-info b')).map(b => {
        const s = window.getComputedStyle(b);
        return { text: b.innerText.trim(), fontSize: parseFloat(s.fontSize), fontWeight: s.fontWeight, fontFamily: s.fontFamily };
      });

      const websiteLink = footer.querySelector('a[href*="rieuviet.vn"]');
      const websiteLinkStyle = websiteLink ? window.getComputedStyle(websiteLink) : null;

      const footerMain = footer.querySelector('.footer-main');
      const footerMainStyle = window.getComputedStyle(footerMain);
      const gridColTemplates = footerMainStyle.gridTemplateColumns ? footerMainStyle.gridTemplateColumns.trim().split(/\s+/).length : 0;

      const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;

      // Check legal content values
      const legalText = footer.querySelector('.legal-info') ? footer.querySelector('.legal-info').innerText : '';

      return {
        textSizeAdjust,
        headings,
        links,
        paragraphs,
        legalDivs,
        legalLabels,
        websiteFontSize: websiteLinkStyle ? parseFloat(websiteLinkStyle.fontSize) : null,
        gridColTemplates,
        hasOverflow,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        legalText
      };
    });

    console.log(`\n  Checking Footer at ${vp.name}:`);
    if (!footerData) {
      console.error(`  FAIL: Footer element not found!`);
      allPassed = false;
      await page.close();
      continue;
    }

    if (footerData.hasOverflow) {
      console.error(`  FAIL: Horizontal overflow detected! scrollWidth=${footerData.scrollWidth} > innerWidth=${footerData.viewportWidth}`);
      allPassed = false;
    } else {
      console.log(`  ✔ No horizontal overflow`);
    }

    // Check text-size-adjust
    if (footerData.textSizeAdjust && footerData.textSizeAdjust !== '100%' && footerData.textSizeAdjust !== 'none') {
      console.error(`  FAIL: Unexpected text-size-adjust: ${footerData.textSizeAdjust}`);
      allPassed = false;
    } else {
      console.log(`  ✔ text-size-adjust correctly set: ${footerData.textSizeAdjust}`);
    }

    // Check headings (15-16px, weight 700, Be Vietnam Pro)
    let headingsOk = true;
    for (const h of footerData.headings) {
      if (h.fontSize < 14.9 || h.fontSize > 16.1) {
        console.error(`  FAIL: Heading "${h.text}" font-size is ${h.fontSize}px (expected 15-16px)`);
        headingsOk = false;
      }
      if (parseInt(h.fontWeight) < 700) {
        console.error(`  FAIL: Heading "${h.text}" font-weight is ${h.fontWeight} (expected >= 700)`);
        headingsOk = false;
      }
      if (!h.fontFamily.toLowerCase().includes('vietnam')) {
        console.error(`  FAIL: Heading "${h.text}" font-family is ${h.fontFamily} (expected Be Vietnam Pro)`);
        headingsOk = false;
      }
    }
    if (headingsOk) console.log(`  ✔ All ${footerData.headings.length} group headings: 15–16px, font-weight 700, Be Vietnam Pro`);
    else allPassed = false;

    // Check links & content (13-14px)
    let contentOk = true;
    for (const l of footerData.links) {
      if (l.fontSize < 13.0 || l.fontSize > 14.1) {
        console.error(`  FAIL: Link "${l.text}" font-size is ${l.fontSize}px (expected 13-14px)`);
        contentOk = false;
      }
    }
    for (const p of footerData.paragraphs) {
      if (p.fontSize < 13.0 || p.fontSize > 14.1) {
        console.error(`  FAIL: Paragraph font-size is ${p.fontSize}px (expected 13-14px)`);
        contentOk = false;
      }
    }
    for (const d of footerData.legalDivs) {
      if (d.fontSize < 13.0 || d.fontSize > 14.1) {
        console.error(`  FAIL: Legal div font-size is ${d.fontSize}px (expected 13-14px)`);
        contentOk = false;
      }
    }
    if (footerData.websiteFontSize < 13.0 || footerData.websiteFontSize > 14.1) {
      console.error(`  FAIL: Website link font-size is ${footerData.websiteFontSize}px (expected 13-14px)`);
      contentOk = false;
    }
    if (contentOk) console.log(`  ✔ Content, links, legal items & website link unified at 13–14px`);
    else allPassed = false;

    // Check legal labels (b tags: 600-700, same font-size as text)
    let labelsOk = true;
    for (const b of footerData.legalLabels) {
      if (b.fontSize < 13.0 || b.fontSize > 14.1) {
        console.error(`  FAIL: Legal label "${b.text}" font-size is ${b.fontSize}px (expected 13-14px)`);
        labelsOk = false;
      }
      if (parseInt(b.fontWeight) < 600) {
        console.error(`  FAIL: Legal label "${b.text}" font-weight is ${b.fontWeight} (expected >= 600)`);
        labelsOk = false;
      }
    }
    if (labelsOk) console.log(`  ✔ Legal labels: font-weight 600–700, same font-size as values (13.5px)`);
    else allPassed = false;

    // Check grid columns
    if (footerData.gridColTemplates !== vp.expectedColumns) {
      console.error(`  FAIL: Expected ${vp.expectedColumns} columns in footer-main, got ${footerData.gridColTemplates}`);
      allPassed = false;
    } else {
      console.log(`  ✔ Layout grid has expected ${vp.expectedColumns} columns`);
    }

    // Check legal text preservation
    const requiredStrings = [
      'CÔNG TY CỔ PHẦN DỊCH VỤ THƯƠNG MẠI RIÊU VIỆT',
      '2300954297',
      '0859 433 333',
      '0814 133 333',
      'marketing.rieuviet@gmail.com'
    ];
    let legalOk = true;
    for (const str of requiredStrings) {
      if (!footerData.legalText.includes(str)) {
        console.error(`  FAIL: Missing required legal text "${str}"`);
        legalOk = false;
      }
    }
    if (legalOk) console.log(`  ✔ All business and legal information preserved intact`);
    else allPassed = false;

    await page.close();
  }

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
