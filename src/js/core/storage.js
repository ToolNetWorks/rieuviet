/**
 * LocalStorage wrapper with error handling and validation
 */

const STORAGE_KEY = 'rieuviet-cart-v1';

export function loadCart(menu) {
  const cart = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cart;
    const stored = JSON.parse(raw);
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
      for (const [id, qty] of Object.entries(stored)) {
        if (menu.some(item => item.id === id) && Number.isInteger(qty) && qty > 0 && qty <= 99) {
          cart[id] = qty;
        }
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return cart;
}

export function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Ignore storage quota/disabled errors
  }
}
