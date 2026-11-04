/**
 * Booking form handling, validation, and clipboard export
 */
import { $, copyTextToClipboard } from '../core/utils.js';
import { toast } from '../components/toast.js';

export function initBooking() {
  const bookingDate = $('#booking-date');
  if (bookingDate) {
    const local = new Date();
    const iso = [
      local.getFullYear(),
      String(local.getMonth() + 1).padStart(2, '0'),
      String(local.getDate()).padStart(2, '0')
    ].join('-');
    bookingDate.min = iso;
  }

  const form = $('#booking-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    const now = new Date();
    const todayIso = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0')
    ].join('-');

    if (data.date < todayIso) {
      toast('Vui lòng chọn ngày hiện tại hoặc trong tương lai');
      return;
    }

    const message = buildBookingMessage(data);
    await copyBookingMessage(message, '#booking-output');
  });
}

function buildBookingMessage(data) {
  const lines = [
    'YÊU CẦU ĐẶT BÀN RIEU VIỆT',
    `Họ tên: ${data.name}`,
    `Số điện thoại: ${data.phone}`,
    `Ngày: ${data.date}`,
    `Giờ: ${data.time}`,
    `Số khách: ${data.guests}`
  ];
  if (data.note) lines.push(`Ghi chú: ${data.note}`);
  lines.push('Vui lòng xác nhận lại với nhà hàng. Đây chưa phải xác nhận đặt bàn/đặt món.');
  return lines.join('\n');
}

async function copyBookingMessage(message, outputSelector) {
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
