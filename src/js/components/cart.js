/**
 * Shopping cart state and drawer UI
 */
import { $, $$, formatMoney, escapeHtml } from '../core/utils.js';
import { getMenu } from '../core/config.js';
import { loadCart, saveCart } from '../core/storage.js';
import { toast } from './toast.js';

let cart = {};

export function initCart() {
  const menu = getMenu();
  cart = loadCart(menu);
  renderCart();

  $('#cart-overlay')?.addEventListener('click', closeCart);
}

export const getCart = () => cart;

export function total() {
  const menu = getMenu();
  return menu.reduce((amount, item) => amount + item.price * (cart[item.id] || 0), 0);
}

export function count() {
  return Object.values(cart).reduce((amount, qty) => amount + qty, 0);
}

function persist() {
  saveCart(cart);
  renderCart();
}

export function updateCart(id, delta) {
  const menu = getMenu();
  const item = menu.find(i => i.id === id);
  if (!item) return;

  const next = Math.max(0, Math.min(99, (cart[id] || 0) + delta));
  if (next === 0) {
    delete cart[id];
  } else {
    cart[id] = next;
  }
  persist();
  if (delta > 0) {
    toast(`Đã thêm ${item.name}`);
  }
}

export function renderCart() {
  const totalCount = count();
  $$('.basket-count').forEach(node => {
    node.textContent = totalCount;
    node.hidden = totalCount === 0;
  });

  const floatCount = $('#float-cart-count');
  if (floatCount) floatCount.textContent = totalCount;

  const root = $('#cart-items');
  if (!root) return;

  const menu = getMenu();
  const items = menu.filter(item => cart[item.id]);

  root.innerHTML = items.length
    ? items.map(item => `
      <div class="cart-row">
        <div>
          <b>${escapeHtml(item.name)}</b><div class="qty">
            <button aria-label="Giảm ${escapeHtml(item.name)}" data-qty="-1" data-id="${item.id}">−</button>
            <span>${cart[item.id]}</span>
            <button aria-label="Tăng ${escapeHtml(item.name)}" data-qty="1" data-id="${item.id}">+</button>
          </div>
        </div>
        <span class="price">${formatMoney(item.price * cart[item.id])}</span>
      </div>`).join('')
    : '<div class="cart-empty"><p>Chưa có món nào được chọn.</p><a class="btn outline small" href="/thuc-don">Xem thực đơn</a></div>';

  const subtotal = $('#cart-total');
  if (subtotal) subtotal.textContent = formatMoney(total());

  const orderButton = $('#order-button');
  if (orderButton) orderButton.disabled = totalCount === 0;
}

export function openCart() {
  $('#cart-drawer')?.classList.add('open');
  $('#cart-overlay')?.classList.add('open');
  document.body.classList.add('no-scroll');
  $('#cart-close')?.focus();
}

export function closeCart() {
  $('#cart-drawer')?.classList.remove('open');
  $('#cart-overlay')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
}
