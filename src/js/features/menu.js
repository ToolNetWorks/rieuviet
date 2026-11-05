/**
 * Menu listing, search, category filters, and 15-page thumbnails
 */
import { $, formatMoney, escapeHtml } from '../core/utils.js';
import { getMenu, getCategories } from '../core/config.js';

let activeCategory = 'all';
let searchText = '';

export function initMenuFeatures() {
  renderFeatured();
  renderFilters();
  renderMenu();
  renderMenuPages();

  const searchInput = $('#menu-search');
  searchInput?.addEventListener('input', event => {
    searchText = event.target.value.trim();
    renderMenu();
  });
}

export function setActiveCategory(category) {
  activeCategory = category;
  renderFilters();
  renderMenu();
}

export function renderFeatured() {
  const root = $('#featured-grid');
  if (!root) return;

  const menu = getMenu();
  const ids = ['lr350', 'lr450', 'lr550', 'lgn490', 'lhs500', 'lnc520'];
  root.innerHTML = ids
    .map(id => menu.find(item => item.id === id))
    .filter(Boolean)
    .map(item => `
      <article class="food-card">
        <div class="food-image">
          <img src="/assets/images/${encodeURIComponent(item.image || 'lau-rieu-450.webp')}" alt="Hình món ${escapeHtml(item.name)} từ thực đơn RIEU VIỆT" loading="lazy" width="520" height="440">
          ${item.tag ? `<span class="food-pill">${escapeHtml(item.tag)}</span>` : ''}
        </div>
        <div class="food-content">
          <h3>${escapeHtml(item.name)}</h3>
          <p class="food-detail">Hình ảnh và giá tham khảo theo thực đơn của nhà hàng. Vui lòng xác nhận khi gọi món.</p>
          <div class="food-bottom">
            <span class="price">${formatMoney(item.price)}</span>
            <button class="add-btn" aria-label="Thêm ${escapeHtml(item.name)}" data-add="${item.id}" title="Thêm vào danh sách món">+</button>
          </div>
        </div>
      </article>`)
    .join('');
}

export function renderFilters() {
  const root = $('#category-list');
  if (!root) return;

  const categories = getCategories();
  root.innerHTML = categories
    .map(category => `
      <button class="category ${activeCategory === category.id ? 'selected' : ''}" aria-pressed="${activeCategory === category.id}" data-category="${category.id}">
        ${escapeHtml(category.label)}
      </button>`)
    .join('');
}

export function renderMenu() {
  const root = $('#menu-list');
  if (!root) return;

  const menu = getMenu();
  const normalized = searchText
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

  const filtered = menu.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    const name = item.name
      .toLocaleLowerCase('vi')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
    return name.includes(normalized);
  });

  root.innerHTML = filtered.length
    ? filtered.map(item => `
      <article class="menu-item">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <span class="price">${formatMoney(item.price)}</span>
        </div>
        <button class="add-btn" aria-label="Thêm ${escapeHtml(item.name)}" data-add="${item.id}">+</button>
      </article>`).join('')
    : '<div class="empty-results">Không tìm thấy món phù hợp. Hãy thử từ khóa khác.</div>';

  const node = $('#menu-result-count');
  if (node) node.textContent = `${filtered.length} món`;
}

export function renderMenuPages() {
  const root = $('#menu-pages');
  if (!root) return;

  root.innerHTML = Array.from({ length: 15 }, (_, i) => {
    const no = String(i + 1).padStart(2, '0');
    return `
      <a class="menu-page" href="/assets/images/menu-page-${no}.webp" target="_blank" rel="noopener" aria-label="Mở trang ${i + 1} của thực đơn">
        <img src="/assets/images/menu-page-${no}.webp" alt="Trang ${i + 1} của thực đơn RIEU VIỆT" loading="lazy" width="901" height="1680">
        <span>Trang ${i + 1}</span>
      </a>`;
  }).join('');
}
