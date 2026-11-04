/**
 * Navigation, keyboard shortcuts, event delegation, and floating cart observer
 */
import { $ } from '../core/utils.js';
import { updateCart, openCart, closeCart } from '../components/cart.js';
import { closeDialog } from './order.js';
import { setActiveCategory } from './menu.js';

export function initNavigation() {
  // Mobile Hamburger Toggle
  const mobileToggle = $('#mobile-toggle');
  const mobileMenu = $('#mobile-menu');
  mobileToggle?.addEventListener('click', () => {
    if (!mobileMenu) return;
    const open = mobileMenu.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(open));
  });

  // Global Event Delegation
  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    if (add) {
      updateCart(add.dataset.add, 1);
      return;
    }

    const qty = event.target.closest('[data-qty]');
    if (qty) {
      updateCart(qty.dataset.id, Number(qty.dataset.qty));
      return;
    }

    const filter = event.target.closest('[data-category]');
    if (filter) {
      setActiveCategory(filter.dataset.category);
      return;
    }

    if (event.target.closest('[data-open-cart]')) {
      openCart();
      return;
    }

    if (event.target.closest('[data-close-cart]')) {
      closeCart();
      return;
    }
  });

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', event => {
    const zoomModal = $('#menu-zoom-modal');
    const isZoomOpen = zoomModal && !zoomModal.hidden;

    if (event.key === 'Escape') {
      if (isZoomOpen) {
        window.RIEU_ZOOM?.close();
        return;
      }
      closeCart();
      closeDialog();
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
      }
      return;
    }

    if (isZoomOpen) {
      if (event.key === 'ArrowLeft') {
        $('[data-zoom-prev]')?.click();
      } else if (event.key === 'ArrowRight') {
        $('[data-zoom-next]')?.click();
      }
    }
  });

  // Floating Cart Observer
  initFloatingCartObserver();
}

function initFloatingCartObserver() {
  const floatCart = $('#float-cart-count')?.closest('.float-cart');
  const bookingBox = $('#dat-ban .reservation-box');
  const menuBook = $('[data-menu-book]');

  if (!floatCart || !('IntersectionObserver' in window)) return;

  const setFloatCartHidden = hidden => {
    floatCart.classList.toggle('is-hidden', hidden);
    floatCart.setAttribute('aria-hidden', String(hidden));
    floatCart.tabIndex = hidden ? -1 : 0;
    if (hidden && document.activeElement === floatCart) {
      floatCart.blur();
    }
  };

  const targets = [bookingBox, menuBook].filter(Boolean);
  if (!targets.length) return;

  const intersecting = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        intersecting.add(entry.target);
      } else {
        intersecting.delete(entry.target);
      }
    });
    setFloatCartHidden(intersecting.size > 0);
  }, { threshold: 0.01 });

  targets.forEach(t => observer.observe(t));
}
