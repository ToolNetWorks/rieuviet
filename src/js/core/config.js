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
    const display = cfg.phoneDisplay || (cfg.phone2 ? `${cfg.phone} · ${cfg.phone2}` : cfg.phone);
    if (node.tagName.toLowerCase() === 'span' && (cfg.phone || cfg.phone2)) {
      const p1 = cfg.phone ? `<a href="tel:${cfg.phone.replace(/[^\d+]/g, '')}">${cfg.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}</a>` : '';
      const p2 = cfg.phone2 ? `<a href="tel:${cfg.phone2.replace(/[^\d+]/g, '')}">${cfg.phone2.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}</a>` : '';
      node.innerHTML = [p1, p2].filter(Boolean).join(' · ');
    } else {
      node.textContent = label(display, 'Đang cập nhật số điện thoại');
    }
  });

  $$('[data-config="email"]').forEach(node => {
    if (node.tagName.toLowerCase() === 'span' && cfg.email?.trim()) {
      node.innerHTML = `<a href="mailto:${cfg.email.trim()}">${cfg.email.trim()}</a>`;
    } else {
      node.textContent = label(cfg.email, 'Đang cập nhật email liên hệ');
    }
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
    const primaryPhone = cfg.phone?.trim() || cfg.phone2?.trim();
    if (primaryPhone) {
      node.href = `tel:${primaryPhone.replace(/[^\d+]/g, '')}`;
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
    legalName: cfg.legalName || 'CÔNG TY CỔ PHẦN DỊCH VỤ THƯƠNG MẠI RIÊU VIỆT',
    url: cfg.domain || 'https://rieuviet.vn',
    servesCuisine: 'Vietnamese',
    hasMenu: `${cfg.domain || 'https://rieuviet.vn'}/thuc-don`
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
