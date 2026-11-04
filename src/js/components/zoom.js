/**
 * Lightbox / Fullscreen Zoom Modal for Menu Pages
 */
import { $, $$ } from '../core/utils.js';

let zoomIndex = 0;
let pagesRef = [];
let preloadFn = () => {};
let onSpreadSync = () => {};

export function initZoom(pages, preloadCallback, syncSpreadCallback) {
  pagesRef = pages;
  preloadFn = preloadCallback || (() => {});
  onSpreadSync = syncSpreadCallback || (() => {});

  const zoomModal = $('#menu-zoom-modal');
  const zoomPrev = $('[data-zoom-prev]');
  const zoomNext = $('[data-zoom-next]');

  zoomPrev?.addEventListener('click', () => {
    if (zoomIndex > 0) {
      zoomIndex--;
      renderZoom();
    }
  });

  zoomNext?.addEventListener('click', () => {
    if (zoomIndex < pagesRef.length - 1) {
      zoomIndex++;
      renderZoom();
    }
  });

  $$('[data-zoom-close]').forEach(btn => btn.addEventListener('click', closeZoom));

  if (zoomModal) {
    let zTouchX = 0;
    let zTouchY = 0;
    zoomModal.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      zTouchX = e.touches[0].clientX;
      zTouchY = e.touches[0].clientY;
    }, { passive: true });

    zoomModal.addEventListener('touchend', e => {
      if (e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - zTouchX;
      const dy = e.changedTouches[0].clientY - zTouchY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        if (dx < 0 && zoomIndex < pagesRef.length - 1) {
          zoomIndex++;
          renderZoom();
        } else if (dx > 0 && zoomIndex > 0) {
          zoomIndex--;
          renderZoom();
        }
      }
    }, { passive: true });
  }

  window.RIEU_ZOOM = { open: openZoom, close: closeZoom };
}

export function renderZoom() {
  const zoomImg = $('#menu-zoom-img');
  const zoomTitle = $('#menu-zoom-title');
  const zoomPrev = $('[data-zoom-prev]');
  const zoomNext = $('[data-zoom-next]');

  if (!zoomImg || !pagesRef[zoomIndex]) return;

  const page = pagesRef[zoomIndex];
  zoomImg.src = page.src;
  zoomImg.alt = page.alt;

  if (zoomTitle) zoomTitle.textContent = `Trang ${zoomIndex + 1} / ${pagesRef.length}`;
  if (zoomPrev) zoomPrev.disabled = zoomIndex === 0;
  if (zoomNext) zoomNext.disabled = zoomIndex >= pagesRef.length - 1;

  if (pagesRef[zoomIndex + 1]) preloadFn(pagesRef[zoomIndex + 1]);
  if (pagesRef[zoomIndex - 1]) preloadFn(pagesRef[zoomIndex - 1]);
}

export function openZoom(index) {
  const zoomModal = $('#menu-zoom-modal');
  const zoomImg = $('#menu-zoom-img');
  if (!zoomModal || !zoomImg) return;

  zoomIndex = Math.max(0, Math.min(pagesRef.length - 1, index));
  renderZoom();

  zoomModal.hidden = false;
  requestAnimationFrame(() => zoomModal.classList.add('open'));
  document.body.classList.add('no-scroll');
}

export function closeZoom() {
  const zoomModal = $('#menu-zoom-modal');
  if (!zoomModal) return;

  zoomModal.classList.remove('open');
  setTimeout(() => {
    zoomModal.hidden = true;
    document.body.classList.remove('no-scroll');
    const syncIndex = zoomIndex - (zoomIndex % 2);
    onSpreadSync(syncIndex);
  }, 200);
}
