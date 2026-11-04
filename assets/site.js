(() => {
  'use strict';
  const cfg = window.RIEU_CONFIG || {};
  const menu = window.RIEU_MENU || [];
  const categories = window.RIEU_CATEGORIES || [];
  const storageKey = 'rieuviet-cart-v1';
  const formatMoney = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
  const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let toastTimeout;
  let cart = {};

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
      for (const [id, qty] of Object.entries(stored)) {
        if (menu.some(item => item.id === id) && Number.isInteger(qty) && qty > 0 && qty <= 99) cart[id] = qty;
      }
    }
  } catch { cart = {}; }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => node.classList.remove('show'), 2800);
  }

  function total() { return menu.reduce((amount, item) => amount + item.price * (cart[item.id] || 0), 0); }
  function count() { return Object.values(cart).reduce((amount, qty) => amount + qty, 0); }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* storage disabled */ }
    renderCart();
  }
  function updateCart(id, delta) {
    const item = menu.find(item => item.id === id);
    if (!item) return;
    const next = Math.max(0, Math.min(99, (cart[id] || 0) + delta));
    if (next === 0) delete cart[id];
    else cart[id] = next;
    persist();
    if (delta > 0) toast(`Đã thêm ${item.name}`);
  }

  function renderCart() {
    $$('.basket-count').forEach(node => { node.textContent = count(); node.hidden = count() === 0; });
    const floatCount = $('#float-cart-count');
    if (floatCount) floatCount.textContent = count();
    const root = $('#cart-items');
    if (!root) return;
    const items = menu.filter(item => cart[item.id]);
    root.innerHTML = items.length ? items.map(item => `
      <div class="cart-row">
        <div>
          <b>${escapeHtml(item.name)}</b><div class="qty">
            <button aria-label="Giảm ${escapeHtml(item.name)}" data-qty="-1" data-id="${item.id}">−</button>
            <span>${cart[item.id]}</span>
            <button aria-label="Tăng ${escapeHtml(item.name)}" data-qty="1" data-id="${item.id}">+</button>
          </div>
        </div>
        <span class="price">${formatMoney(item.price * cart[item.id])}</span>
      </div>`).join('') : '<div class="cart-empty"><p>Chưa có món nào được chọn.</p><a class="btn outline small" href="/thuc-don">Xem thực đơn</a></div>';
    const subtotal = $('#cart-total');
    if (subtotal) subtotal.textContent = formatMoney(total());
    const orderButton = $('#order-button');
    if (orderButton) orderButton.disabled = count() === 0;
  }

  function openCart() {
    $('#cart-drawer')?.classList.add('open');
    $('#cart-overlay')?.classList.add('open');
    document.body.classList.add('no-scroll');
    $('#cart-close')?.focus();
  }
  function closeCart() {
    $('#cart-drawer')?.classList.remove('open');
    $('#cart-overlay')?.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  function openDialog() {
    closeCart();
    $('#order-dialog')?.classList.add('open');
    $('#dialog-overlay')?.classList.add('open');
    document.body.classList.add('no-scroll');
    $('#order-name')?.focus();
  }
  function closeDialog() {
    $('#order-dialog')?.classList.remove('open');
    $('#dialog-overlay')?.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  function renderFeatured() {
    const root = $('#featured-grid');
    if (!root) return;
    const ids = ['lr350','lr450','lr550','lgn490','lhs500','lnc520'];
    root.innerHTML = ids.map(id => menu.find(item => item.id === id)).filter(Boolean).map(item => `
      <article class="food-card">
        <div class="food-image">
          <img src="/assets/images/${encodeURIComponent(item.image || 'lau-rieu-450.webp')}" alt="Hình món ${escapeHtml(item.name)} từ thực đơn RIEU VIỆT" loading="lazy" width="520" height="440">
          ${item.tag ? `<span class="food-pill">${escapeHtml(item.tag)}</span>` : ''}
        </div>
        <div class="food-content"><h3>${escapeHtml(item.name)}</h3>
          <p class="food-detail">Hình ảnh và giá tham khảo theo thực đơn của nhà hàng. Vui lòng xác nhận khi gọi món.</p>
          <div class="food-bottom"><span class="price">${formatMoney(item.price)}</span>
          <button class="add-btn" aria-label="Thêm ${escapeHtml(item.name)}" data-add="${item.id}" title="Thêm vào danh sách món">+</button></div>
        </div>
      </article>`).join('');
  }

  let activeCategory = 'all';
  let searchText = '';
  function renderMenu() {
    const root = $('#menu-list');
    if (!root) return;
    const normalized = searchText.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
    const filtered = menu.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      const name = item.name.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
      return name.includes(normalized);
    });
    root.innerHTML = filtered.length ? filtered.map(item => `
      <article class="menu-item">
        <div><h3>${escapeHtml(item.name)}</h3><span class="price">${formatMoney(item.price)}</span></div>
        <button class="add-btn" aria-label="Thêm ${escapeHtml(item.name)}" data-add="${item.id}">+</button>
      </article>`).join('') : '<div class="empty-results">Không tìm thấy món phù hợp. Hãy thử từ khóa khác.</div>';
    const node = $('#menu-result-count');
    if (node) node.textContent = `${filtered.length} món`;
  }
  function renderFilters() {
    const root = $('#category-list');
    if (!root) return;
    root.innerHTML = categories.map(category => `<button class="category ${activeCategory===category.id?'selected':''}" aria-pressed="${activeCategory===category.id}" data-category="${category.id}">${escapeHtml(category.label)}</button>`).join('');
  }
  function renderMenuPages() {
    const root = $('#menu-pages');
    if (!root) return;
    root.innerHTML = Array.from({length:15}, (_,i) => {
      const no = String(i+1).padStart(2,'0');
      return `<a class="menu-page" href="/assets/images/menu-page-${no}.webp" target="_blank" rel="noopener" aria-label="Mở trang ${i+1} của thực đơn">
        <img src="/assets/images/menu-page-${no}.webp" alt="Trang ${i+1} của thực đơn RIEU VIỆT" loading="lazy" width="514" height="960"><span>Trang ${i+1}</span>
      </a>`;
    }).join('');
  }

  function renderConfig() {
    const label = (value, fallback) => value?.trim() || fallback;
    $$('[data-config="address"]').forEach(node => node.textContent = label(cfg.address, 'Đang cập nhật địa chỉ quán'));
    $$('[data-config="phone"]').forEach(node => node.textContent = label(cfg.phone, 'Đang cập nhật số điện thoại'));
    $$('[data-config="email"]').forEach(node => node.textContent = label(cfg.email, 'Đang cập nhật email liên hệ'));
    $$('[data-config="openingHours"]').forEach(node => node.textContent = label(cfg.openingHours, 'Vui lòng liên hệ quán để xác nhận giờ phục vụ'));
    $$('[data-config="legalName"]').forEach(node => node.textContent = label(cfg.legalName, 'Chưa cập nhật đơn vị kinh doanh'));
    $$('[data-config="taxCode"]').forEach(node => node.textContent = label(cfg.taxCode, 'Chưa cập nhật mã số thuế'));
    $$('[data-link="phone"]').forEach(node => {
      if (cfg.phone?.trim()) { node.href = `tel:${cfg.phone.replace(/[^\d+]/g,'')}`; return; }
      node.href = '/lien-he.html';
      node.setAttribute('title','Thông tin số điện thoại đang được cập nhật');
    });
    $$('[data-link="email"]').forEach(node => {
      node.href = cfg.email?.trim() ? `mailto:${cfg.email.trim()}` : '/lien-he.html';
    });
    $$('[data-link="map"]').forEach(node => {
      node.href = cfg.mapUrl?.trim() || '/lien-he.html';
      if (cfg.mapUrl?.trim()) { node.target = '_blank'; node.rel='noopener'; }
    });
    $$('[data-config="onlinePayment"]').forEach(node => {
      node.textContent = cfg.onlinePaymentEnabled ? 'Thanh toán trực tuyến theo phương thức đang được kích hoạt' : 'Thanh toán trực tuyến bằng thẻ đang chờ kích hoạt. Không yêu cầu nhập dữ liệu thẻ trên website này.';
    });
    const ld = { '@context':'https://schema.org', '@type':'Restaurant',name:'RIEU VIỆT',url:'https://rieuviet.com',servesCuisine:'Vietnamese',hasMenu:'https://rieuviet.com/thuc-don' };
    if (cfg.address?.trim()) ld.address = {'@type':'PostalAddress',streetAddress:cfg.address.trim(),addressCountry:'VN'};
    if (cfg.phone?.trim()) ld.telephone=cfg.phone.trim();
    if (cfg.email?.trim()) ld.email=cfg.email.trim();
    const script=document.createElement('script');script.type='application/ld+json';script.textContent=JSON.stringify(ld);document.head.appendChild(script);
  }

  function requestText(kind, data) {
    const header = kind === 'booking' ? 'YÊU CẦU ĐẶT BÀN RIEU VIỆT' : 'YÊU CẦU ĐẶT TRƯỚC MÓN — RIEU VIỆT';
    const contact = [`Họ tên: ${data.name}`,`Số điện thoại: ${data.phone}`];
    if (kind === 'booking') contact.push(`Ngày: ${data.date}`,`Giờ: ${data.time}`,`Số khách: ${data.guests}`);
    if (kind === 'order') {
      contact.push('Các món đã chọn:');
      menu.filter(item => cart[item.id]).forEach(item => contact.push(`- ${item.name} × ${cart[item.id]}: ${formatMoney(item.price * cart[item.id])}`));
      contact.push(`Tổng giá menu (chưa xác nhận): ${formatMoney(total())}`);
    }
    if (data.note) contact.push(`Ghi chú: ${data.note}`);
    contact.push('Vui lòng xác nhận lại với nhà hàng. Đây chưa phải xác nhận đặt bàn/đặt món.');
    return [header,...contact].join('\n');
  }
  async function copyMessage(message, outputSelector) {
    try {
      await navigator.clipboard.writeText(message);
      toast('Đã sao chép nội dung yêu cầu');
      if (outputSelector) { const node=$(outputSelector); if(node)node.textContent='Đã sao chép. Hãy gửi cho nhà hàng qua số điện thoại hoặc kênh liên hệ chính thức.'; }
    } catch {
      const node = outputSelector ? $(outputSelector) : null;
      if (node) node.textContent = message;
      toast('Hãy sao chép nội dung hiển thị và liên hệ nhà hàng');
    }
  }

  function initMenuBook() {
    const book = $('[data-menu-book]');
    if (!book) return;
    book.classList.add('is-ready');
    const stage = $('.menu-book-stage', book);
    const leftPage = $('.menu-book-page--left', book);
    const rightPage = $('.menu-book-page--right', book);
    const flip = $('[data-menu-flip]', book);
    const flipFront = $('.menu-book-flip-front img', book);
    const flipBack = $('.menu-book-flip-back img', book);
    const counter = $('[data-menu-counter]', book);
    const prevButton = $('[data-menu-prev]', book);
    const nextButton = $('[data-menu-next]', book);
    const singleQuery = window.matchMedia('(max-width: 640px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pagePromises = new Map();
    const pages = Array.from({ length: 15 }, (_, index) => ({
      src: `/assets/images/menu-page-${String(index + 1).padStart(2, '0')}.webp`,
      alt: `Trang ${index + 1} trong thực đơn RIEU VIỆT`
    }));
    let current = 0;
    let animating = false;
    let swipeStart = null;

    function setImage(img, page) {
      if (!img) return;
      if (!page) { img.removeAttribute('src'); img.alt = ''; return; }
      if (img.getAttribute('src') !== page.src) img.src = page.src;
      img.alt = page.alt;
    }

    function setPage(container, page) {
      if (!container) return;
      const image = $('img', container);
      const isBlank = !page && !singleQuery.matches;
      container.classList.toggle('is-blank', isBlank);
      if (!image) return;
      if (!page) { image.hidden = true; image.removeAttribute('src'); image.alt = ''; return; }
      image.hidden = false;
      if (image.getAttribute('src') !== page.src) image.src = page.src;
      image.alt = page.alt;
    }

    function getSpread(index) {
      if (singleQuery.matches) return [pages[index], null];
      const start = index - index % 2;
      return [pages[start], pages[start + 1] || null];
    }

    function preload(page) {
      if (!page) return;
      if (!pagePromises.has(page.src)) {
        pagePromises.set(page.src, new Promise(resolve => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = resolve;
          image.src = page.src;
        }));
      }
    }

    function schedulePreload() {
      const run = () => {
        if (singleQuery.matches) {
          [current + 1, current + 2, current + 3].forEach(idx => {
            if (pages[idx]) preload(pages[idx]);
          });
        } else {
          const start = current - current % 2;
          [start + 2, start + 3, start + 4, start + 5].forEach(idx => {
            if (pages[idx]) preload(pages[idx]);
          });
        }
      };
      if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1000 });
      else setTimeout(run, 150);
    }

    function updateControls() {
      if (prevButton) prevButton.disabled = animating || current === 0;
      if (nextButton) nextButton.disabled = animating || current >= pages.length - 1;
      if (!counter) return;
      if (singleQuery.matches) {
        counter.textContent = `Trang ${current + 1} / ${pages.length}`;
        return;
      }
      const start = current - current % 2;
      const end = Math.min(start + 1, pages.length - 1);
      counter.textContent = start === end ? `Trang ${start + 1} / ${pages.length}` : `Trang ${start + 1}–${end + 1} / ${pages.length}`;
    }

    function renderPages() {
      if (!singleQuery.matches) current -= current % 2;
      const [left, right] = getSpread(current);
      setPage(leftPage, left);
      setPage(rightPage, right);
      updateControls();
      schedulePreload();
    }

    function playFlipAnimation(direction, onFinish) {
      return new Promise(resolve => {
        if (!flip) { onFinish(); resolve(); return; }
        flip.classList.remove('is-next', 'is-prev', 'is-flipping', 'is-active');
        flip.classList.add(direction === 'next' ? 'is-next' : 'is-prev');
        void flip.offsetWidth;
        flip.classList.add('is-active');
        void flip.offsetWidth;

        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          flip.removeEventListener('animationend', handleEnd);
          onFinish();
          flip.classList.remove('is-active', 'is-flipping', 'is-next', 'is-prev');
          resolve();
        };

        const handleEnd = event => { if (event.target === flip) finish(); };
        flip.addEventListener('animationend', handleEnd);
        requestAnimationFrame(() => {
          if (!finished) flip.classList.add('is-flipping');
        });
        setTimeout(finish, singleQuery.matches ? 480 : 680);
      });
    }

    async function go(direction) {
      if (animating) return;
      const isSingle = singleQuery.matches;
      const step = isSingle ? 1 : 2;
      const target = direction === 'next' ? Math.min(current + step, pages.length - 1) : Math.max(current - step, 0);
      if (target === current) return;

      animating = true;
      updateControls();

      if (reducedMotion.matches) {
        current = target;
        animating = false;
        renderPages();
        return;
      }

      if (isSingle) {
        const oldPage = pages[current];
        const newPage = pages[target];
        preload(newPage);

        if (direction === 'next') {
          setPage(leftPage, newPage);
          setImage(flipFront, oldPage);
          setImage(flipBack, null);
        } else {
          setPage(leftPage, oldPage);
          setImage(flipFront, newPage);
          setImage(flipBack, null);
        }

        await playFlipAnimation(direction, () => {
          current = target;
          renderPages();
        });
      } else {
        const oldPages = getSpread(current);
        const newPages = getSpread(target);
        const frontPage = direction === 'next' ? oldPages[1] : oldPages[0];
        const backPage = direction === 'next' ? newPages[0] : newPages[1];

        preload(newPages[0]);
        if (newPages[1]) preload(newPages[1]);

        if (direction === 'next') {
          setPage(leftPage, oldPages[0]);
          setPage(rightPage, newPages[1]);
        } else {
          setPage(leftPage, newPages[0]);
          setPage(rightPage, oldPages[1]);
        }

        setImage(flipFront, frontPage);
        setImage(flipBack, backPage);

        await playFlipAnimation(direction, () => {
          current = target;
          renderPages();
        });
      }

      animating = false;
      updateControls();
    }

    const handleModeChange = () => {
      if (animating) return;
      if (!singleQuery.matches) current -= current % 2;
      renderPages();
    };
    if (typeof singleQuery.addEventListener === 'function') singleQuery.addEventListener('change', handleModeChange);
    else singleQuery.addListener(handleModeChange);

    prevButton?.addEventListener('click', () => go('prev'));
    nextButton?.addEventListener('click', () => go('next'));
    leftPage?.addEventListener('click', event => {
      if (singleQuery.matches || animating) return;
      if (event.target.closest('a, button')) return;
      go('prev');
    });
    rightPage?.addEventListener('click', event => {
      if (singleQuery.matches || animating) return;
      if (event.target.closest('a, button')) return;
      go('next');
    });
    book.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); go('prev'); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); go('next'); }
    });

    if (stage) {
      let touchStartX = 0;
      let touchStartY = 0;

      stage.addEventListener('touchstart', event => {
        if (event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      }, { passive: true });

      stage.addEventListener('touchend', event => {
        if (animating || event.changedTouches.length !== 1) return;
        const dx = event.changedTouches[0].clientX - touchStartX;
        const dy = event.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          go(dx < 0 ? 'next' : 'prev');
        }
      }, { passive: true });

      stage.addEventListener('pointerdown', event => {
        if (animating || event.pointerType === 'touch' || (event.pointerType === 'mouse' && event.button !== 0)) return;
        swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
      });

      stage.addEventListener('pointerup', event => {
        if (!swipeStart || event.pointerId !== swipeStart.id) return;
        const dx = event.clientX - swipeStart.x;
        const dy = event.clientY - swipeStart.y;
        swipeStart = null;
        if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          go(dx < 0 ? 'next' : 'prev');
        }
      });

      stage.addEventListener('pointercancel', () => { swipeStart = null; });
    }

    renderPages();
  }

  // Event delegation for controls inserted dynamically.
  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    if (add) { updateCart(add.dataset.add, 1); return; }
    const qty = event.target.closest('[data-qty]');
    if (qty) { updateCart(qty.dataset.id, Number(qty.dataset.qty)); return; }
    const filter = event.target.closest('[data-category]');
    if (filter) { activeCategory=filter.dataset.category; renderFilters(); renderMenu(); return; }
    if (event.target.closest('[data-open-cart]')) { openCart(); return; }
    if (event.target.closest('[data-close-cart]')) { closeCart(); return; }
  });
  $('#cart-overlay')?.addEventListener('click',closeCart);
  $('#dialog-overlay')?.addEventListener('click',closeDialog);
  $('#dialog-close')?.addEventListener('click',closeDialog);
  $('#order-button')?.addEventListener('click',openDialog);
  $('#mobile-toggle')?.addEventListener('click',() => {
    const nav = $('#mobile-menu');
    if (!nav) return;
    const open=nav.classList.toggle('open');
    $('#mobile-toggle').setAttribute('aria-expanded',String(open));
  });
  $('#menu-search')?.addEventListener('input',event=>{ searchText=event.target.value.trim();renderMenu(); });
  $('#order-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    if (!count()) { toast('Vui lòng chọn ít nhất một món'); return; }
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    copyMessage(requestText('order',data),'#order-output');
  });
  $('#booking-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    const form=event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const now = new Date();
    const todayIso = [now.getFullYear(), String(now.getMonth()+1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-');
    if (data.date < todayIso) { toast('Vui lòng chọn ngày hiện tại hoặc trong tương lai'); return; }
    copyMessage(requestText('booking',data),'#booking-output');
  });
  const bookingDate = $('#booking-date');
  if (bookingDate) {
    const local = new Date();
    const iso = [local.getFullYear(),String(local.getMonth()+1).padStart(2,'0'),String(local.getDate()).padStart(2,'0')].join('-');
    bookingDate.min=iso;
  }
  const floatCart = $('#float-cart-count')?.closest('.float-cart');
  const bookingBox = $('#dat-ban .reservation-box');
  const menuBook = $('[data-menu-book]');
  if (floatCart && 'IntersectionObserver' in window) {
    const setFloatCartHidden = hidden => {
      floatCart.classList.toggle('is-hidden', hidden);
      floatCart.setAttribute('aria-hidden', String(hidden));
      floatCart.tabIndex = hidden ? -1 : 0;
      if (hidden && document.activeElement === floatCart) floatCart.blur();
    };
    const targets = [bookingBox, menuBook].filter(Boolean);
    if (targets.length) {
      const intersecting = new Set();
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        });
        setFloatCartHidden(intersecting.size > 0);
      }, { threshold: 0.01 });
      targets.forEach(t => observer.observe(t));
    }
  }
  document.addEventListener('keydown',event=>{
    if (event.key !== 'Escape') return;
    closeCart();closeDialog();
    const nav=$('#mobile-menu');if(nav){nav.classList.remove('open');$('#mobile-toggle')?.setAttribute('aria-expanded','false');}
  });
  renderConfig();renderFeatured();renderFilters();renderMenu();renderMenuPages();renderCart();try{initMenuBook();}catch(e){console.error("Menu book init error:",e);}
})();
