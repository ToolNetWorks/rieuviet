/**
 * Menu listing, search, and category filters.
 * (15-page original menu is rendered via the shared Flipbook component)
 */
import { $, formatMoney, escapeHtml } from '../core/utils.js';
import { getMenu, getCategories } from '../core/config.js';

let activeCategory = 'all';
let searchText = '';

export function initMenuFeatures() {
  renderFeatured();
  renderFilters();
  renderMenu();

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

const FEATURED_DESCRIPTIONS = {
  lr350: 'Set lẩu riêu cua đồng thanh ngọt, sườn sụn tươi giòn cùng đồ nhúng hấp dẫn cho 2–3 người.',
  lr450: 'Set lẩu riêu cua bắp bò, sườn sụn đậm đà chuẩn vị truyền thống cho 3–4 người.',
  lr550: 'Set lẩu riêu cua đặc biệt đầy đặn với đa dạng đồ nhúng thượng hạng cho 4–6 người.',
  lgn490: 'Nước dùng gà ta thanh ngọt tự nhiên kết hợp cùng các loại nấm tươi bổ dưỡng.',
  lhs500: 'Hải sản tươi ngon hòa quyện cùng nước lẩu chua cay đậm đà tròn vị.',
  lnc520: 'Thịt chim câu bổ dưỡng hầm cùng nấm tươi thơm ngọt, vị thanh nhẹ ấm lòng.'
};

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
          <p class="food-detail">${escapeHtml(FEATURED_DESCRIPTIONS[item.id] || 'Món ngon chế biến từ nguyên liệu tươi ngon theo công thức đặc trưng của RIEU VIỆT.')}</p>
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
