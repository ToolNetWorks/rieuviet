"""
HTML layout templates and UI wrappers.
"""
from html import escape
from .config import LINKS, POLICIES, EMBLEM, CART_ICON

def brand():
    return (
        f'<a class="brand" href="/" aria-label="RIEU VIỆT - Trang chủ">'
        f'<span class="brand-emblem">{EMBLEM}</span>'
        f'<span class="brand-copy"><strong>RIEU VIỆT</strong><small>ĐẬM ĐÀ HƯƠNG VIỆT</small></span>'
        f'</a>'
    )

def header(active):
    nav = ''.join(f'<a href="{url}" class="{"active" if active == ident else ""}">{title}</a>' for title, url, ident in LINKS)
    return (
        f'<a href="#main" class="skip">Bỏ qua điều hướng</a>\n'
        f' <div class="header-top">RIEU VIỆT &nbsp;·&nbsp; THƯỞNG LẨU ĐẬM ĐÀ, SUM VẦY TRỌN VỊ</div>\n'
        f' <header class="header"><div class="container header-inner">\n'
        f' {brand()}<nav class="nav" aria-label="Điều hướng chính">{nav}<a href="/#dat-ban">Đặt bàn</a></nav>\n'
        f' <div class="header-actions"><a class="btn small" href="/#dat-ban">ĐẶT BÀN</a><button class="basket-trigger" data-open-cart aria-label="Mở danh sách món đã chọn">{CART_ICON}<span class="basket-count" hidden>0</span></button><button id="mobile-toggle" class="hamburger" aria-label="Mở menu" aria-expanded="false" aria-controls="mobile-menu">☰</button></div>\n'
        f' </div><nav id="mobile-menu" class="mobile-menu" aria-label="Điều hướng trên điện thoại">{nav}<a href="/#dat-ban">Đặt bàn</a></nav></header>'
    )

def footer():
    policies = ''.join(f'<li><a href="{u}">{n}</a></li>' for n, u in POLICIES)
    return (
        f'<footer class="footer" id="footer"><div class="container"><div class="footer-main">\n'
        f'  <div>{brand()}<p style="margin-top:22px;max-width:310px">RIEU VIỆT — thực đơn lẩu riêu và các món ăn Việt. Giá món ăn được giới thiệu theo thực đơn của nhà hàng.</p><p>Website: <a href="https://rieuviet.vn">rieuviet.vn</a></p></div>\n'
        f'  <div><h4>Khám phá</h4><ul><li><a href="/">Trang chủ</a></li><li><a href="/thuc-don.html">Thực đơn & bảng giá</a></li><li><a href="/gioi-thieu.html">Giới thiệu</a></li><li><a href="/#dat-ban">Đặt bàn</a></li><li><a href="/lien-he.html">Liên hệ</a></li></ul></div>\n'
        f'  <div><h4>Chính sách</h4><ul>{policies}</ul></div>\n'
        f'  <div><h4>Thông tin đơn vị</h4><div class="legal-info"><div><b>Tên đơn vị:</b> <span data-config="legalName">CÔNG TY CỔ PHẦN DỊCH VỤ THƯƠNG MẠI RIÊU VIỆT</span></div><div><b>MST:</b> <span data-config="taxCode">2300954297</span></div><div><b>Địa chỉ:</b> <span data-config="address">Số 01 Hàn Mạc Tử, Phường Kinh Bắc, Bắc Ninh, Việt Nam</span></div><div><b>Điện thoại:</b> <span data-config="phone"><a href="tel:0859433333">0859 433 333</a> · <a href="tel:0814133333">0814 133 333</a></span></div><div><b>Email:</b> <span data-config="email"><a href="mailto:marketing.rieuviet@gmail.com">marketing.rieuviet@gmail.com</a></span></div></div></div>\n'
        f' </div><div class="footer-bottom"><span>© 2026 RIEU VIỆT. Bảo lưu quyền thương hiệu theo quy định pháp luật.</span><span>Website giới thiệu thực đơn · Chưa thu thập thông tin thẻ thanh toán</span></div></div></footer>\n'
        f' <button class="float-cart" data-open-cart aria-label="Mở danh sách món">{CART_ICON} Đã chọn <span id="float-cart-count">0</span> món</button>'
    )

def overlays():
    return (
        '<div class="drawer-overlay" id="cart-overlay"></div>\n'
        ' <aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Danh sách món đã chọn"><div class="drawer-head"><h2>Món đã chọn</h2><button id="cart-close" data-close-cart class="icon-btn" aria-label="Đóng danh sách">×</button></div>\n'
        ' <div class="cart-items" id="cart-items"></div><div class="cart-foot"><div class="cart-total"><span>Tổng theo menu</span><strong id="cart-total">0đ</strong></div><button id="order-button" class="btn" disabled>Chuẩn bị yêu cầu đặt món</button><p>Đây là danh sách dự kiến. Nhà hàng chỉ xác nhận món và giá sau khi liên hệ trực tiếp; chưa thanh toán trên website.</p></div></aside>\n'
        ' <div id="dialog-overlay" class="dialog-overlay"></div><section id="order-dialog" class="dialog" role="dialog" aria-modal="true" aria-labelledby="order-dialog-title"><div class="dialog-head"><h2 id="order-dialog-title">Yêu cầu đặt món</h2><button class="icon-btn" id="dialog-close" aria-label="Đóng">×</button></div><p style="font-size:12px;color:#706258">Điền thông tin để tạo tin nhắn đặt trước món. Nhân viên quán cần xác nhận trước khi đơn có hiệu lực.</p>\n'
        ' <form id="order-form"><div class="field"><label for="order-name">Họ và tên *</label><input id="order-name" name="name" required maxlength="80" autocomplete="name" placeholder="Họ tên khách hàng"></div><div class="field"><label for="order-phone">Số điện thoại *</label><input id="order-phone" name="phone" type="tel" required minlength="9" maxlength="16" pattern="[+0-9 ]{9,16}" placeholder="Số liên hệ" autocomplete="tel"></div><div class="field"><label for="order-note">Ghi chú</label><textarea id="order-note" name="note" maxlength="500" placeholder="Thời gian dự kiến, số người... (nếu có)"></textarea></div><button class="btn" type="submit" style="width:100%">Sao chép nội dung đặt món</button></form><p id="order-output" class="form-message" style="white-space:pre-wrap"></p><a class="text-link" data-link="phone" href="/lien-he.html">Liên hệ quán để xác nhận</a></section>\n'
        ' <div id="toast" class="toast" role="status" aria-live="polite"></div>\n'
        ' <div id="menu-zoom-modal" class="menu-zoom-modal" role="dialog" aria-modal="true" aria-label="Xem phóng to trang thực đơn" hidden>\n'
        '   <div class="menu-zoom-backdrop" data-zoom-close></div>\n'
        '   <div class="menu-zoom-dialog">\n'
        '     <div class="menu-zoom-bar">\n'
        '       <span class="menu-zoom-title" id="menu-zoom-title">Trang 1 / 15</span>\n'
        '       <div class="menu-zoom-actions">\n'
        '         <button class="menu-zoom-btn" type="button" data-zoom-prev aria-label="Trang trước">‹ Trước</button>\n'
        '         <button class="menu-zoom-btn" type="button" data-zoom-next aria-label="Trang sau">Sau ›</button>\n'
        '         <button class="menu-zoom-close" type="button" data-zoom-close aria-label="Đóng phóng to">✕ Đóng</button>\n'
        '       </div>\n'
        '     </div>\n'
        '     <div class="menu-zoom-body">\n'
        '       <img id="menu-zoom-img" alt="Trang thực đơn phóng to" width="901" height="1680" draggable="false">\n'
        '     </div>\n'
        '     <div class="menu-zoom-hint">Chạm hoặc vuốt trái/phải để chuyển trang · Bấm ✕ hoặc chạm ngoài để đóng</div>\n'
        '   </div>\n'
        ' </div>'
    )

def pagehero(tag, title, sub):
    return f'<section class="page-hero"><div class="container"><div class="eyebrow">{tag}</div><h1>{title}</h1><p>{sub}</p></div></section>'

def menu_book(fallback_html=None):
    if fallback_html is None:
        fallback_html = '<a class="text-link" href="/thuc-don.html#menu-goc" style="color:#f4cc98">Xem toàn bộ 15 trang thực đơn <span aria-hidden="true">↗</span></a>'
    return (
        ' <div class="menu-book" data-menu-book role="region" aria-label="Sách thực đơn RIEU VIỆT">\n'
        '   <div class="menu-book-stage">\n'
        '     <div class="menu-book-spread">\n'
        '       <div class="menu-book-page menu-book-page--left" data-zoom-page="left" role="button" tabindex="0" aria-label="Chạm để phóng to trang trái">\n'
        '         <img src="/assets/images/menu-page-01.webp" alt="Trang 1 trong thực đơn RIEU VIỆT" width="901" height="1680" loading="eager" decoding="async" draggable="false">\n'
        '         <span class="menu-book-zoom-badge" aria-hidden="true"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg><span>Phóng to</span></span>\n'
        '       </div>\n'
        '       <div class="menu-book-page menu-book-page--right" data-zoom-page="right" role="button" tabindex="0" aria-label="Chạm để phóng to trang phải">\n'
        '         <img src="/assets/images/menu-page-02.webp" alt="Trang 2 trong thực đơn RIEU VIỆT" width="901" height="1680" loading="lazy" decoding="async" draggable="false">\n'
        '         <span class="menu-book-zoom-badge" aria-hidden="true"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg><span>Phóng to</span></span>\n'
        '         <div class="menu-book-end" aria-hidden="true"><span class="menu-book-end-title">RIEU VIỆT</span><span class="menu-book-end-sub">Đậm đà hương Việt</span></div>\n'
        '       </div>\n'
        '       <div class="menu-book-flip" data-menu-flip aria-hidden="true">\n'
        '         <div class="menu-book-flip-face menu-book-flip-front"><img alt="" width="901" height="1680" draggable="false"></div>\n'
        '         <div class="menu-book-flip-face menu-book-flip-back"><img alt="" width="901" height="1680" draggable="false"></div>\n'
        '       </div>\n'
        '     </div>\n'
        '   </div>\n'
        '   <div class="menu-book-controls">\n'
        '     <button class="menu-book-btn" type="button" data-menu-prev disabled aria-label="Trang trước">Trang trước</button>\n'
        '     <p class="menu-book-counter" data-menu-counter aria-live="polite">Trang 1–2 / 15</p>\n'
        '     <button class="menu-book-btn" type="button" data-menu-next aria-label="Trang sau">Trang sau</button>\n'
        '   </div>\n'
        '   <div class="menu-book-fallback">\n'
        f'     {fallback_html}\n'
        '   </div>\n'
        ' </div>'
    )

def page(title, desc, active, content, canonical, versions, og_type='website'):
    titlefull = f'{title} | RIEU VIỆT — Lẩu Riêu & Ẩm Thực Việt' if title != 'Trang chủ' else 'RIEU VIỆT — Lẩu Riêu Đậm Đà Hương Việt | Thực Đơn & Đặt Bàn'
    css_v = versions['css']
    config_v = versions['config']
    menu_data_v = versions['menu_data']
    site_v = versions['site']

    return (
        f'<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#752832">\n'
        f' <title>{escape(titlefull)}</title><meta name="description" content="{escape(desc, quote=True)}"><link rel="canonical" href="https://rieuviet.vn{canonical}">\n'
        f' <meta property="og:type" content="{og_type}"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="RIEU VIỆT"><meta property="og:title" content="{escape(titlefull, quote=True)}"><meta property="og:description" content="{escape(desc, quote=True)}"><meta property="og:url" content="https://rieuviet.vn{canonical}"><meta property="og:image" content="https://rieuviet.vn/assets/images/lau-rieu-450.webp"><meta name="twitter:card" content="summary_large_image">\n'
        f' <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/styles.css?v={css_v}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        f' <script defer src="/assets/config.js?v={config_v}"></script><script defer src="/assets/menu-data.js?v={menu_data_v}"></script><script defer src="/assets/site.js?v={site_v}"></script></head>\n'
        f' <body>{header(active)}<main id="main">{content}</main>{footer()}{overlays()}</body></html>'
    )
