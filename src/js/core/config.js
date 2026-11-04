/**
 * Configuration and metadata handlers
 */
import { $, $$ } from './utils.js';

export const getConfig = () => window.RIEU_CONFIG || {};
export const getMenu = () => window.RIEU_MENU || [];
export const getCategories = () => window.RIEU_CATEGORIES || [];

export function renderConfig() {
  const cfg = getConfig();
  const label = (value, fallback) => (value?.trim() ? value.trim() : fallback);

  $$('[data-config="address"]').forEach(node => {
    node.textContent = label(cfg.address, 'Đang cập nhật địa chỉ quán');
  });

  $$('[data-config="phone"]').forEach(node => {
    node.textContent = label(cfg.phone, 'Đang cập nhật số điện thoại');
  });

  $$('[data-config="email"]').forEach(node => {
    node.textContent = label(cfg.email, 'Đang cập nhật email liên hệ');
  });

  $$('[data-config="openingHours"]').forEach(node => {
    node.textContent = label(cfg.openingHours, 'Vui lòng liên hệ quán để xác nhận giờ phục vụ');
  });

  $$('[data-config="legalName"]').forEach(node => {
    node.textContent = label(cfg.legalName, 'Chưa cập nhật đơn vị kinh doanh');
  });

  $$('[data-config="taxCode"]').forEach(node => {
    node.textContent = label(cfg.taxCode, 'Chưa cập nhật mã số thuế');
  });

  $$('[data-link="phone"]').forEach(node => {
    if (cfg.phone?.trim()) {
      node.href = `tel:${cfg.phone.replace(/[^\d+]/g, '')}`;
      return;
    }
    node.href = '/lien-he.html';
    node.setAttribute('title', 'Thông tin số điện thoại đang được cập nhật');
  });

  $$('[data-link="email"]').forEach(node => {
    node.href = cfg.email?.trim() ? `mailto:${cfg.email.trim()}` : '/lien-he.html';
  });

  $$('[data-link="map"]').forEach(node => {
    node.href = cfg.mapUrl?.trim() || '/lien-he.html';
    if (cfg.mapUrl?.trim()) {
      node.target = '_blank';
      node.rel = 'noopener';
    }
  });

  $$('[data-config="onlinePayment"]').forEach(node => {
    node.textContent = cfg.onlinePaymentEnabled
      ? 'Thanh toán trực tuyến theo phương thức đang được kích hoạt'
      : 'Thanh toán trực tuyến bằng thẻ đang chờ kích hoạt. Không yêu cầu nhập dữ liệu thẻ trên website này.';
  });

  // Inject Schema.org Restaurant
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'RIEU VIỆT',
    url: 'https://rieuviet.com',
    servesCuisine: 'Vietnamese',
    hasMenu: 'https://rieuviet.com/thuc-don'
  };
  if (cfg.address?.trim()) {
    ld.address = {
      '@type': 'PostalAddress',
      streetAddress: cfg.address.trim(),
      addressCountry: 'VN'
    };
  }
  if (cfg.phone?.trim()) ld.telephone = cfg.phone.trim();
  if (cfg.email?.trim()) ld.email = cfg.email.trim();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}
