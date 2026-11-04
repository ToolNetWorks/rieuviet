/**
 * Toast notifications
 */
import { $ } from '../core/utils.js';

let toastTimeout;

export function toast(message) {
  const node = $('#toast');
  if (!node) return;
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    node.classList.remove('show');
  }, 2800);
}
