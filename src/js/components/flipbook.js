/**
 * 2-Page Spread Flipbook Component
 * Maintains two facing pages on all viewports with smooth 3D page flip animation,
 * touch gestures, and tap-to-zoom integration.
 */
import { $, $$ } from '../core/utils.js';
import { initZoom, openZoom } from './zoom.js';

export function initMenuBook() {
  const book = $('[data-menu-book]');
  if (!book) return;

  book.classList.add('is-ready');
  const stage = $('.menu-book-stage', book);
  const leftPage = $('.menu-book-page--left', book);
  const rightPage = $('.menu-book-page--right', book);
  const flip = $('[data-menu-flip]', book);
  const flipFront = $('.menu-book-flip-front img', book);
  const flipBack = $('.menu-book-flip-back img', book);
  const counter = $('[data-menu-counter]', book);
  const prevButton = $('[data-menu-prev]', book);
  const nextButton = $('[data-menu-next]', book);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pagePromises = new Map();

  const pages = Array.from({ length: 15 }, (_, index) => ({
    src: `/assets/images/menu-page-${String(index + 1).padStart(2, '0')}.webp`,
    alt: `Trang ${index + 1} trong thực đơn RIEU VIỆT`
  }));

  let current = 0;
  let animating = false;

  function setImage(img, page) {
    if (!img) return;
    if (!page) {
      img.removeAttribute('src');
      img.alt = '';
      return;
    }
    if (img.getAttribute('src') !== page.src) img.src = page.src;
    img.alt = page.alt;
  }

  function setPage(container, page) {
    if (!container) return;
    const image = $('img', container);
    const isBlank = !page;
    container.classList.toggle('is-blank', isBlank);
    if (!image) return;
    if (!page) {
      image.hidden = true;
      image.removeAttribute('src');
      image.alt = '';
      return;
    }
    image.hidden = false;
    if (image.getAttribute('src') !== page.src) image.src = page.src;
    image.alt = page.alt;
  }

  function getSpread(index) {
    const start = index - (index % 2);
    return [pages[start], pages[start + 1] || null];
  }

  function preload(page) {
    if (!page) return;
    if (!pagePromises.has(page.src)) {
      pagePromises.set(page.src, new Promise(resolve => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = resolve;
        image.src = page.src;
      }));
    }
  }

  function schedulePreload() {
    const run = () => {
      const start = current - (current % 2);
      [start + 2, start + 3, start + 4, start + 5].forEach(idx => {
        if (pages[idx]) preload(pages[idx]);
      });
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 1000 });
    } else {
      setTimeout(run, 150);
    }
  }

  function updateControls() {
    if (prevButton) prevButton.disabled = animating || current === 0;
    if (nextButton) nextButton.disabled = animating || current >= pages.length - 2;
    if (!counter) return;

    const start = current - (current % 2);
    const end = Math.min(start + 1, pages.length - 1);
    counter.textContent = start === end
      ? `Trang ${start + 1} / ${pages.length}`
      : `Trang ${start + 1}–${end + 1} / ${pages.length}`;
  }

  function renderPages() {
    current -= current % 2;
    const [left, right] = getSpread(current);
    setPage(leftPage, left);
    setPage(rightPage, right);
    updateControls();
    schedulePreload();
  }

  function playFlipAnimation(direction, onFinish) {
    return new Promise(resolve => {
      if (!flip) {
        onFinish();
        resolve();
        return;
      }
      flip.classList.remove('is-next', 'is-prev', 'is-flipping', 'is-active');
      flip.classList.add(direction === 'next' ? 'is-next' : 'is-prev');
      void flip.offsetWidth;
      flip.classList.add('is-active');
      void flip.offsetWidth;

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        flip.removeEventListener('animationend', handleEnd);
        onFinish();
        flip.classList.remove('is-active', 'is-flipping', 'is-next', 'is-prev');
        resolve();
      };

      const handleEnd = event => {
        if (event.target === flip) finish();
      };
      flip.addEventListener('animationend', handleEnd);
      requestAnimationFrame(() => {
        if (!finished) flip.classList.add('is-flipping');
      });
      setTimeout(finish, 650);
    });
  }

  async function go(direction) {
    if (animating) return;
    const step = 2;
    const target = direction === 'next'
      ? Math.min(current + step, pages.length - 1)
      : Math.max(current - step, 0);

    if (target === current) return;

    animating = true;
    updateControls();

    if (reducedMotion.matches) {
      current = target;
      animating = false;
      renderPages();
      return;
    }

    const oldPages = getSpread(current);
    const newPages = getSpread(target);
    const frontPage = direction === 'next' ? oldPages[1] : oldPages[0];
    const backPage = direction === 'next' ? newPages[0] : newPages[1];

    preload(newPages[0]);
    if (newPages[1]) preload(newPages[1]);

    if (direction === 'next') {
      setPage(leftPage, oldPages[0]);
      setPage(rightPage, newPages[1]);
    } else {
      setPage(leftPage, newPages[0]);
      setPage(rightPage, oldPages[1]);
    }

    setImage(flipFront, frontPage);
    setImage(flipBack, backPage);

    await playFlipAnimation(direction, () => {
      current = target;
      renderPages();
    });

    animating = false;
    updateControls();
  }

  prevButton?.addEventListener('click', () => go('prev'));
  nextButton?.addEventListener('click', () => go('next'));

  book.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go('prev');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go('next');
    }
  });

  if (stage) {
    let touchStartX = 0;
    let touchStartY = 0;

    stage.addEventListener('touchstart', event => {
      if (event.touches.length !== 1) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });

    stage.addEventListener('touchend', event => {
      if (animating || event.changedTouches.length !== 1) return;
      const dx = event.changedTouches[0].clientX - touchStartX;
      const dy = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        go(dx < 0 ? 'next' : 'prev');
      }
    }, { passive: true });
  }

  function bindZoomTrigger(container, isRight) {
    if (!container) return;
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchSwipe = false;
    let lastTouchTime = 0;

    container.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTouchSwipe = false;
    }, { passive: true });

    container.addEventListener('touchmove', e => {
      if (e.touches.length !== 1) return;
      if (Math.abs(e.touches[0].clientX - touchStartX) > 12 || Math.abs(e.touches[0].clientY - touchStartY) > 12) {
        isTouchSwipe = true;
      }
    }, { passive: true });

    container.addEventListener('touchend', e => {
      if (animating || isTouchSwipe) return;
      if (e.target.closest('a, button')) return;
      lastTouchTime = Date.now();
      const spreadStart = current - (current % 2);
      const targetPage = isRight ? spreadStart + 1 : spreadStart;
      if (targetPage < pages.length) openZoom(targetPage);
      else openZoom(spreadStart);
    });

    container.addEventListener('click', e => {
      if (animating || (Date.now() - lastTouchTime < 450)) return;
      if (e.target.closest('a, button')) return;
      const spreadStart = current - (current % 2);
      const targetPage = isRight ? spreadStart + 1 : spreadStart;
      if (targetPage < pages.length) openZoom(targetPage);
      else openZoom(spreadStart);
    });

    container.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const spreadStart = current - (current % 2);
        const targetPage = isRight ? spreadStart + 1 : spreadStart;
        if (targetPage < pages.length) openZoom(targetPage);
        else openZoom(spreadStart);
      }
    });
  }

  bindZoomTrigger(leftPage, false);
  bindZoomTrigger(rightPage, true);

  $$('[data-open-zoom-all]').forEach(btn => {
    btn.addEventListener('click', () => {
      const spreadStart = current - (current % 2);
      openZoom(spreadStart);
    });
  });

  // Initialize lightbox with callback to sync current spread when closed
  initZoom(pages, preload, newIndex => {
    current = newIndex;
    renderPages();
  });

  renderPages();
}
