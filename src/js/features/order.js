/**
 * Pre-order dialog, form handling, and clipboard message generation
 */
import { $, copyTextToClipboard, formatMoney } from '../core/utils.js';
import { getMenu } from '../core/config.js';
import { getCart, total, count, closeCart } from '../components/cart.js';
import { toast } from '../components/toast.js';

export function initOrder() {
  $('#dialog-overlay')?.addEventListener('click', closeDialog);
  $('#dialog-close')?.addEventListener('click', closeDialog);
  $('#order-button')?.addEventListener('click', openDialog);

  const form = $('#order-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!count()) {
      toast('Vui lòng chọn ít nhất một món');
      return;
    }
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    const message = buildOrderMessage(data);
    await copyOrderMessage(message, '#order-output');
  });
}

export function openDialog() {
  closeCart();
  $('#order-dialog')?.classList.add('open');
  $('#dialog-overlay')?.classList.add('open');
  document.body.classList.add('no-scroll');
  $('#order-name')?.focus();
}

export function closeDialog() {
  $('#order-dialog')?.classList.remove('open');
  $('#dialog-overlay')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function buildOrderMessage(data) {
  const menu = getMenu();
  const cart = getCart();

  const lines = [
    'YÊU CẦU ĐẶT TRƯỚC MÓN — RIEU VIỆT',
    `Họ tên: ${data.name}`,
    `Số điện thoại: ${data.phone}`,
    'Các món đã chọn:'
  ];

  menu
    .filter(item => cart[item.id])
    .forEach(item => {
      lines.push(`- ${item.name} × ${cart[item.id]}: ${formatMoney(item.price * cart[item.id])}`);
    });

  lines.push(`Tổng giá menu (chưa xác nhận): ${formatMoney(total())}`);
  if (data.note) lines.push(`Ghi chú: ${data.note}`);
  lines.push('Vui lòng xác nhận lại với nhà hàng. Đây chưa phải xác nhận đặt bàn/đặt món.');
  return lines.join('\n');
}

async function copyOrderMessage(message, outputSelector) {
  const node = outputSelector ? $(outputSelector) : null;
  try {
    await copyTextToClipboard(message);
    toast('Đã sao chép nội dung yêu cầu');
    if (node) {
      node.textContent = 'Đã sao chép. Hãy gửi cho nhà hàng qua số điện thoại hoặc kênh liên hệ chính thức.';
    }
  } catch {
    if (node) node.textContent = message;
    toast('Hãy sao chép nội dung hiển thị và liên hệ nhà hàng');
  }
}
