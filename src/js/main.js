/**
 * RIEU VIỆT — Application Main Entrypoint
 * Initializes configuration, cart, menu features, flipbook, booking, order, and navigation.
 */
import { renderConfig } from './core/config.js';
import { initCart } from './components/cart.js';
import { initMenuBook } from './components/flipbook.js';
import { initMenuFeatures } from './features/menu.js';
import { initBooking } from './features/booking.js';
import { initOrder } from './features/order.js';
import { initNavigation } from './features/navigation.js';

function bootstrap() {
  renderConfig();
  initCart();
  initMenuFeatures();
  initBooking();
  initOrder();
  initNavigation();

  try {
    initMenuBook();
  } catch (error) {
    console.error('Menu book init error:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
