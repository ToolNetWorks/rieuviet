from pathlib import Path
from html import escape
import hashlib

ROOT=Path(__file__).resolve().parent

def asset_hash(rel_path):
    p = ROOT / rel_path
    if p.is_file():
        return hashlib.md5(p.read_bytes()).hexdigest()[:8]
    return '1'

CSS_V = asset_hash('assets/styles.css')
CONFIG_V = asset_hash('assets/config.js')
MENU_DATA_V = asset_hash('assets/menu-data.js')
SITE_V = asset_hash('assets/site.js')
LINKS=[('Trang chủ','/','index'),('Thực đơn','/thuc-don.html','thuc-don'),('Giới thiệu','/gioi-thieu.html','gioi-thieu'),('Liên hệ','/lien-he.html','lien-he')]
POLICIES=[('Thanh toán','/chinh-sach-thanh-toan.html'),('Hoàn / hủy','/chinh-sach-hoan-huy.html'),('Giao nhận','/chinh-sach-giao-nhan.html'),('Bảo mật','/chinh-sach-bao-mat.html'),('Điều khoản','/dieu-khoan-su-dung.html')]
EMBLEM='<svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true"><path d="M7 23h26c0 9-6 14-13 14S7 32 7 23Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 23h32M15 18c-4-5 4-7 1-13m9 13c-4-5 4-7 1-13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>'
CART_ICON='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h2l2.1 10.5h10.8L21 9H7M9 21h.01M18 21h.01"/></svg>'

def brand():
 return f'<a class="brand" href="/" aria-label="RIEU VIỆT - Trang chủ"><span class="brand-emblem">{EMBLEM}</span><span class="brand-copy"><strong>RIEU VIỆT</strong><small>ĐẬM ĐÀ HƯƠNG VIỆT</small></span></a>'

def header(active):
 nav=''.join(f'<a href="{url}" class="{"active" if active==ident else ""}">{title}</a>' for title,url,ident in LINKS)
 return f'''<a href="#main" class="skip">Bỏ qua điều hướng</a>
 <div class="header-top">RIEU VIỆT &nbsp;·&nbsp; THƯỞNG LẨU ĐẬM ĐÀ, SUM VẦY TRỌN VỊ</div>
 <header class="header"><div class="container header-inner">
 {brand()}<nav class="nav" aria-label="Điều hướng chính">{nav}<a href="/#dat-ban">Đặt bàn</a></nav>
 <div class="header-actions"><a class="btn small" href="/#dat-ban">ĐẶT BÀN</a><button class="basket-trigger" data-open-cart aria-label="Mở danh sách món đã chọn">{CART_ICON}<span class="basket-count" hidden>0</span></button><button id="mobile-toggle" class="hamburger" aria-label="Mở menu" aria-expanded="false" aria-controls="mobile-menu">☰</button></div>
 </div><nav id="mobile-menu" class="mobile-menu" aria-label="Điều hướng trên điện thoại">{nav}<a href="/#dat-ban">Đặt bàn</a></nav></header>'''

def footer():
 policies=''.join(f'<li><a href="{u}">{n}</a></li>' for n,u in POLICIES)
 return f'''<footer class="footer" id="footer"><div class="container"><div class="footer-main">
  <div>{brand()}<p style="margin-top:22px;max-width:310px">RIEU VIỆT — thực đơn lẩu riêu và các món ăn Việt. Giá món ăn được giới thiệu theo thực đơn của nhà hàng.</p><p>Website: <a href="https://rieuviet.com">rieuviet.com</a></p></div>
  <div><h4>Khám phá</h4><ul><li><a href="/">Trang chủ</a></li><li><a href="/thuc-don.html">Thực đơn & bảng giá</a></li><li><a href="/gioi-thieu.html">Giới thiệu</a></li><li><a href="/#dat-ban">Đặt bàn</a></li><li><a href="/lien-he.html">Liên hệ</a></li></ul></div>
  <div><h4>Chính sách</h4><ul>{policies}</ul></div>
  <div><h4>Thông tin đơn vị</h4><div class="legal-info"><div><b>Tên đơn vị:</b> <span data-config="legalName"></span></div><div><b>MST:</b> <span data-config="taxCode"></span></div><div><b>Địa chỉ:</b> <span data-config="address"></span></div><div><b>Điện thoại:</b> <span data-config="phone"></span></div><div><b>Email:</b> <span data-config="email"></span></div></div></div>
 </div><div class="footer-bottom"><span>© 2026 RIEU VIỆT. Bảo lưu quyền thương hiệu theo quy định pháp luật.</span><span>Website giới thiệu thực đơn · Chưa thu thập thông tin thẻ thanh toán</span></div></div></footer>
 <button class="float-cart" data-open-cart aria-label="Mở danh sách món">{CART_ICON} Đã chọn <span id="float-cart-count">0</span> món</button>'''

def overlays():
 return '''<div class="drawer-overlay" id="cart-overlay"></div>
 <aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Danh sách món đã chọn"><div class="drawer-head"><h2>Món đã chọn</h2><button id="cart-close" data-close-cart class="icon-btn" aria-label="Đóng danh sách">×</button></div>
 <div class="cart-items" id="cart-items"></div><div class="cart-foot"><div class="cart-total"><span>Tổng theo menu</span><strong id="cart-total">0đ</strong></div><button id="order-button" class="btn" disabled>Chuẩn bị yêu cầu đặt món</button><p>Đây là danh sách dự kiến. Nhà hàng chỉ xác nhận món và giá sau khi liên hệ trực tiếp; chưa thanh toán trên website.</p></div></aside>
 <div id="dialog-overlay" class="dialog-overlay"></div><section id="order-dialog" class="dialog" role="dialog" aria-modal="true" aria-labelledby="order-dialog-title"><div class="dialog-head"><h2 id="order-dialog-title">Yêu cầu đặt món</h2><button class="icon-btn" id="dialog-close" aria-label="Đóng">×</button></div><p style="font-size:12px;color:#706258">Điền thông tin để tạo tin nhắn đặt trước món. Nhân viên quán cần xác nhận trước khi đơn có hiệu lực.</p>
 <form id="order-form"><div class="field"><label for="order-name">Họ và tên *</label><input id="order-name" name="name" required maxlength="80" autocomplete="name" placeholder="Họ tên khách hàng"></div><div class="field"><label for="order-phone">Số điện thoại *</label><input id="order-phone" name="phone" type="tel" required minlength="9" maxlength="16" pattern="[+0-9 ]{9,16}" placeholder="Số liên hệ" autocomplete="tel"></div><div class="field"><label for="order-note">Ghi chú</label><textarea id="order-note" name="note" maxlength="500" placeholder="Thời gian dự kiến, số người... (nếu có)"></textarea></div><button class="btn" type="submit" style="width:100%">Sao chép nội dung đặt món</button></form><p id="order-output" class="form-message" style="white-space:pre-wrap"></p><a class="text-link" data-link="phone" href="/lien-he.html">Liên hệ quán để xác nhận</a></section>
 <div id="toast" class="toast" role="status" aria-live="polite"></div>
 <div id="menu-zoom-modal" class="menu-zoom-modal" role="dialog" aria-modal="true" aria-label="Xem phóng to trang thực đơn" hidden>
   <div class="menu-zoom-backdrop" data-zoom-close></div>
   <div class="menu-zoom-dialog">
     <div class="menu-zoom-bar">
       <span class="menu-zoom-title" id="menu-zoom-title">Trang 1 / 15</span>
       <div class="menu-zoom-actions">
         <button class="menu-zoom-btn" type="button" data-zoom-prev aria-label="Trang trước">‹ Trước</button>
         <button class="menu-zoom-btn" type="button" data-zoom-next aria-label="Trang sau">Sau ›</button>
         <button class="menu-zoom-close" type="button" data-zoom-close aria-label="Đóng phóng to">✕ Đóng</button>
       </div>
     </div>
     <div class="menu-zoom-body">
       <img id="menu-zoom-img" alt="Trang thực đơn phóng to" width="901" height="1680" draggable="false">
     </div>
     <div class="menu-zoom-hint">Chạm hoặc vuốt trái/phải để chuyển trang · Bấm ✕ hoặc chạm ngoài để đóng</div>
   </div>
 </div>'''

def page(title,desc,active,content,canonical,og_type='website'):
 titlefull=f'{title} | RIEU VIỆT — Lẩu Riêu & Ẩm Thực Việt' if title!='Trang chủ' else 'RIEU VIỆT — Lẩu Riêu Đậm Đà Hương Việt | Thực Đơn & Đặt Bàn'
 return f'''<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#752832">
 <title>{escape(titlefull)}</title><meta name="description" content="{escape(desc,quote=True)}"><link rel="canonical" href="https://rieuviet.com{canonical}">
 <meta property="og:type" content="{og_type}"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="RIEU VIỆT"><meta property="og:title" content="{escape(titlefull,quote=True)}"><meta property="og:description" content="{escape(desc,quote=True)}"><meta property="og:url" content="https://rieuviet.com{canonical}"><meta property="og:image" content="https://rieuviet.com/assets/images/lau-rieu-450.webp"><meta name="twitter:card" content="summary_large_image">
 <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/styles.css?v={CSS_V}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 <script defer src="/assets/config.js?v={CONFIG_V}"></script><script defer src="/assets/menu-data.js?v={MENU_DATA_V}"></script><script defer src="/assets/site.js?v={SITE_V}"></script></head>
 <body>{header(active)}<main id="main">{content}</main>{footer()}{overlays()}</body></html>'''

def pagehero(tag,title,sub):
 return f'<section class="page-hero"><div class="container"><div class="eyebrow">{tag}</div><h1>{title}</h1><p>{sub}</p></div></section>'

home='''<section class="hero"><div class="container hero-inner"><div class="hero-copy">
 <div class="eyebrow gold">NHÀ HÀNG LẨU RIÊU VIỆT</div><div class="line"></div>
 <h1>Lẩu ngon.<br><em>Trọn vị Việt.</em><br>Trọn niềm vui.</h1>
 <p class="lead">Từ nồi lẩu riêu đậm đà đến những món ăn quây quần bên mâm cơm, RIEU VIỆT giới thiệu thực đơn đa dạng cho những dịp sum họp.</p>
 <div class="hero-buttons"><a class="btn light" href="/thuc-don.html">KHÁM PHÁ THỰC ĐƠN <span aria-hidden="true">↗</span></a><a class="btn outline" href="/#dat-ban" style="border-color:#f9e8da;color:#f9e8da">ĐẶT BÀN</a></div>
 <div class="hero-stat"><div><strong>350K</strong><span>SET LẨU RIÊU TỪ</span></div><div><strong>15 trang</strong><span>THỰC ĐƠN GỐC</span></div><div><strong>Nhiều lựa chọn</strong><span>LẨU · MÓN NHÚNG · MÓN KÈM</span></div></div>
 </div><div class="hero-visual"><div class="hero-food-caption">Món ngon sum vầy</div><div class="hero-plate"><img src="/assets/images/lau-rieu-450.webp" alt="Set Lẩu Riêu Việt với đồ nhúng theo thực đơn nhà hàng" width="480" height="470" fetchpriority="high"></div><div class="hero-seal"><span>SET LẨU RIÊU</span><strong>450K</strong><span>THEO THỰC ĐƠN</span></div></div></div></section>
 <section class="intro-strip" aria-label="Đặc điểm website"><div class="container">
 <div class="intro-item"><span class="intro-icon">01</span><div><b>Món lẩu chủ đạo</b><p>Lẩu riêu nhiều mức set dễ lựa chọn</p></div></div>
 <div class="intro-item"><span class="intro-icon">02</span><div><b>Thực đơn rõ giá</b><p>Tham khảo trực tiếp theo menu quán</p></div></div>
 <div class="intro-item"><span class="intro-icon">03</span><div><b>Đặt bàn dễ dàng</b><p>Chuẩn bị yêu cầu để liên hệ xác nhận</p></div></div>
 </div></section>
<section class="section" id="mon-noi-bat"><div class="container"><div class="section-heading"><div class="eyebrow">GỢI Ý HÔM NAY</div><h2>Vị ngon làm nên cuộc hẹn</h2><p>Các set lẩu nổi bật từ thực đơn chính thức do nhà hàng cung cấp.</p></div>
<div class="featured-grid" id="featured-grid"></div><div class="center-action"><a href="/thuc-don.html" class="btn outline">XEM TOÀN BỘ THỰC ĐƠN <span aria-hidden="true">↗</span></a></div></div></section>
 <section class="section" style="padding-top:30px;padding-bottom:95px"><div class="container story"><div class="story-art"><img src="/assets/images/lau-hai-san.webp" alt="Set lẩu hải sản trong thực đơn RIEU VIỆT" loading="lazy"><img src="/assets/images/lau-rieu-550.webp" alt="Set lẩu riêu 550K trong thực đơn RIEU VIỆT" loading="lazy"></div><div class="story-copy"><div class="eyebrow">HƯƠNG VỊ ĐƯỢC GÌN GIỮ</div><h2>Ngồi bên nồi lẩu,<br>gần nhau hơn.</h2><div class="stroke"></div><p>Bữa ăn ngon không chỉ nằm ở món ăn mà còn ở khoảnh khắc mọi người cùng ngồi lại. RIEU VIỆT mang đến lựa chọn từ lẩu riêu, lẩu gà nấm, hải sản đến các món ăn kèm.</p><div class="quote">“Đậm đà hương Việt”</div><div class="story-actions"><a class="text-link" href="/thuc-don.html">Khám phá hương vị RIEU VIỆT <span aria-hidden="true">↗</span></a></div></div></div></section>
 <section class="section dark-feature"><div class="container"><div><div class="eyebrow gold">TỪ THỰC ĐƠN CỦA QUÁN</div><h2>Không chỉ có<br>lẩu riêu.</h2><p>Lẩu hải sản, lẩu gà nấm, bò Tứ Xuyên và nhiều món nhúng, món ăn kèm được thể hiện trong menu.</p><a class="btn light" href="/thuc-don.html" style="margin-top:22px">XEM MENU & BẢNG GIÁ</a></div><div class="menu-book" data-menu-book role="region" aria-label="Sách thực đơn RIEU VIỆT">
  <div class="menu-book-stage">
    <div class="menu-book-spread">
      <div class="menu-book-page menu-book-page--left" data-zoom-page="left" role="button" tabindex="0" aria-label="Chạm để phóng to trang trái">
        <img src="/assets/images/menu-page-01.webp" alt="Trang 1 trong thực đơn RIEU VIỆT" width="901" height="1680" loading="eager" decoding="async" draggable="false">
        <span class="menu-book-zoom-badge" aria-hidden="true"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg><span>Phóng to</span></span>
      </div>
      <div class="menu-book-page menu-book-page--right" data-zoom-page="right" role="button" tabindex="0" aria-label="Chạm để phóng to trang phải">
        <img src="/assets/images/menu-page-02.webp" alt="Trang 2 trong thực đơn RIEU VIỆT" width="901" height="1680" loading="lazy" decoding="async" draggable="false">
        <span class="menu-book-zoom-badge" aria-hidden="true"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg><span>Phóng to</span></span>
        <div class="menu-book-end" aria-hidden="true"><span class="menu-book-end-title">RIEU VIỆT</span><span class="menu-book-end-sub">Đậm đà hương Việt</span></div>
      </div>
      <div class="menu-book-flip" data-menu-flip aria-hidden="true">
        <div class="menu-book-flip-face menu-book-flip-front"><img alt="" width="901" height="1680" draggable="false"></div>
        <div class="menu-book-flip-face menu-book-flip-back"><img alt="" width="901" height="1680" draggable="false"></div>
      </div>
    </div>
  </div>
  <div class="menu-book-controls">
    <button class="menu-book-btn" type="button" data-menu-prev disabled aria-label="Trang trước">Trang trước</button>
    <p class="menu-book-counter" data-menu-counter aria-live="polite">Trang 1–2 / 15</p>
    <button class="menu-book-btn" type="button" data-menu-next aria-label="Trang sau">Trang sau</button>
  </div>
  <div class="menu-book-fallback">
    <a class="text-link" href="/thuc-don.html#menu-goc" style="color:#f4cc98">Xem toàn bộ 15 trang thực đơn <span aria-hidden="true">↗</span></a>
  </div>
</div></div></section>
 <section id="dat-ban" class="section reservation"><div class="container reservation-inner"><div><div class="eyebrow gold">LÊN LỊCH GẶP NHAU</div><h2>Hẹn nhau<br>bên nồi lẩu.</h2><p>Chuẩn bị thông tin đặt bàn để liên hệ nhà hàng. Yêu cầu chỉ được xác nhận khi có phản hồi trực tiếp từ quán.</p><div style="padding:22px 0"><b>Giờ phục vụ</b><p data-config="openingHours"></p><b>Liên hệ</b><p><a data-link="phone" href="/lien-he.html" style="color:#ffe0b6" data-config="phone"></a></p></div></div>
 <div class="reservation-box"><h3>Gửi thông tin đặt bàn</h3><p class="muted" style="font-size:11px">Điền thông tin bên dưới để tạo phiếu đặt bàn.</p><form id="booking-form"><div class="field-grid"><div class="field"><label for="booking-name">Họ và tên *</label><input id="booking-name" name="name" autocomplete="name" required maxlength="80" placeholder="Họ tên khách"></div><div class="field"><label for="booking-phone">Số điện thoại *</label><input id="booking-phone" name="phone" type="tel" required minlength="9" maxlength="16" pattern="[+0-9 ]{9,16}" autocomplete="tel" placeholder="Số liên hệ"></div><div class="field"><label for="booking-date">Ngày đến *</label><input id="booking-date" name="date" type="date" required></div><div class="field"><label for="booking-time">Giờ dự kiến *</label><select id="booking-time" name="time" required aria-label="Giờ dự kiến"><option value="">Chọn giờ</option><option value="00:00">00:00</option><option value="00:30">00:30</option><option value="01:00">01:00</option><option value="01:30">01:30</option><option value="02:00">02:00</option><option value="02:30">02:30</option><option value="03:00">03:00</option><option value="03:30">03:30</option><option value="04:00">04:00</option><option value="04:30">04:30</option><option value="05:00">05:00</option><option value="05:30">05:30</option><option value="06:00">06:00</option><option value="06:30">06:30</option><option value="07:00">07:00</option><option value="07:30">07:30</option><option value="08:00">08:00</option><option value="08:30">08:30</option><option value="09:00">09:00</option><option value="09:30">09:30</option><option value="10:00">10:00</option><option value="10:30">10:30</option><option value="11:00">11:00</option><option value="11:30">11:30</option><option value="12:00">12:00</option><option value="12:30">12:30</option><option value="13:00">13:00</option><option value="13:30">13:30</option><option value="14:00">14:00</option><option value="14:30">14:30</option><option value="15:00">15:00</option><option value="15:30">15:30</option><option value="16:00">16:00</option><option value="16:30">16:30</option><option value="17:00">17:00</option><option value="17:30">17:30</option><option value="18:00">18:00</option><option value="18:30">18:30</option><option value="19:00">19:00</option><option value="19:30">19:30</option><option value="20:00">20:00</option><option value="20:30">20:30</option><option value="21:00">21:00</option><option value="21:30">21:30</option><option value="22:00">22:00</option><option value="22:30">22:30</option><option value="23:00">23:00</option><option value="23:30">23:30</option></select></div><div class="field field-wide"><label for="booking-guests">Số khách *</label><select id="booking-guests" name="guests" required><option value="">Chọn số khách</option><option>1–2 người</option><option>3–4 người</option><option>5–6 người</option><option>7–10 người</option><option>Trên 10 người</option></select></div><div class="field field-wide"><label for="booking-note">Yêu cầu thêm (nếu có)</label><textarea id="booking-note" name="note" maxlength="500" placeholder="Ví dụ: bàn gia đình, vị trí ngồi..."></textarea></div></div><button class="btn" type="submit">SAO CHÉP YÊU CẦU ĐẶT BÀN</button><p class="form-message" id="booking-output" style="white-space:pre-wrap">Website chưa nhận đặt bàn tự động. Hãy liên hệ nhà hàng để được xác nhận.</p></form></div></div></section>'''
(ROOT/'index.html').write_text(page('Trang chủ','Khám phá thực đơn RIEU VIỆT — lẩu riêu set 350K, 450K, 550K, cùng nhiều món lẩu và món ăn kèm. Xem menu, bảng giá và thông tin đặt bàn.', 'index',home,'/'),encoding='utf-8')

menu=pagehero('THỰC ĐƠN RIEU VIỆT','Chọn món trọn vị','Tìm nhanh món yêu thích, xem giá theo menu gốc và chuẩn bị danh sách món trước khi liên hệ với quán.')+'''<section class="menu-tools"><div class="container"><div class="menu-tool-row"><div class="search-box"><span aria-hidden="true">⌕</span><input id="menu-search" type="search" autocomplete="off" aria-label="Tìm kiếm món ăn" placeholder="Tìm tên món, ví dụ: lẩu riêu, tôm, bò..."></div><div style="display:flex;gap:10px;align-items:center"><small class="muted" id="menu-result-count"></small><a class="text-link" href="#menu-goc">Xem menu gốc ↘</a></div></div><div id="category-list" class="category-list" aria-label="Lọc món theo nhóm"></div></div></section>
<section class="section-sm"><div class="container"><div class="menu-note"><b>Lưu ý về giá:</b> Giá được nhập từ thực đơn PDF của quán; nếu có thay đổi, nhân viên sẽ xác nhận lại trước khi phục vụ. Các món trong danh sách dùng để chuẩn bị yêu cầu đặt món, không phải đơn hàng đã được xác nhận hoặc thanh toán.</div><div id="menu-list" class="menu-list" aria-live="polite"></div></div></section>
<section class="section" id="menu-goc" style="background:#ede5d8"><div class="container"><div class="section-heading"><div class="eyebrow">THỰC ĐƠN NHÀ HÀNG</div><h2>Xem menu gốc 15 trang</h2><p>Hình ảnh từng trang lấy trực tiếp từ tài liệu thực đơn do nhà hàng cung cấp.</p><a class="btn outline" href="/thuc-don-rieu-viet.pdf" download style="margin-top:18px">TẢI THỰC ĐƠN PDF</a></div><div id="menu-pages" class="menu-pages"></div></div></section>'''
(ROOT/'thuc-don.html').write_text(page('Thực đơn & bảng giá','Thực đơn Lẩu Riêu Việt gồm các set lẩu riêu 350K, 450K, 550K, lẩu hải sản, gà nấm, đồ nhúng và nhiều món ăn Việt. Xem đầy đủ 15 trang menu.', 'thuc-don',menu,'/thuc-don'),encoding='utf-8')

contact=pagehero('CHÚNG TÔI Ở ĐÂY','Liên hệ RIEU VIỆT','Thông tin kết nối với nhà hàng, giờ phục vụ và hướng dẫn liên hệ đặt bàn.')+'''<section class="section"><div class="container"><div class="section-heading"><div class="eyebrow">RIEU VIỆT · ĐẬM ĐÀ HƯƠNG VIỆT</div><h2>Hẹn bạn tại quán</h2><p>Liên hệ trực tiếp để xác nhận bàn trống, món ăn và giờ phục vụ.</p></div><div class="contact-strip"><div class="contact-tile"><b>Địa chỉ nhà hàng</b><p data-config="address"></p><a class="text-link" data-link="map" href="/lien-he.html" style="margin-top:11px">Xem vị trí / liên hệ quán</a></div><div class="contact-tile"><b>Điện thoại</b><p><a data-link="phone" data-config="phone" href="/lien-he.html"></a></p><p>Đặt bàn và xác nhận món vui lòng liên hệ trực tiếp.</p></div><div class="contact-tile"><b>Email</b><p><a data-link="email" data-config="email" href="/lien-he.html"></a></p></div><div class="contact-tile"><b>Giờ mở cửa</b><p data-config="openingHours"></p></div></div><div class="notice" style="margin-top:35px">Thông tin pháp lý, địa chỉ, số điện thoại và giờ phục vụ cần được chủ quán cập nhật chính xác trước khi công bố website hoặc gửi SePay xét duyệt.</div></div></section>'''
about=pagehero('VỀ THƯƠNG HIỆU','Chuyện của RIEU VIỆT','Không gian ẩm thực mang tên RIEU VIỆT, lấy các món lẩu và món ăn Việt làm trung tâm của bữa ăn sum họp.')+'''<section class="section"><div class="container story"><div class="story-art"><img src="/assets/images/lau-rieu-350.webp" alt="Set lẩu riêu Việt 350K" loading="lazy"><img src="/assets/images/lau-rieu-550.webp" alt="Set lẩu riêu Việt 550K" loading="lazy"></div><div class="story-copy"><div class="eyebrow">RIEU VIỆT · ĐẬM ĐÀ HƯƠNG VIỆT</div><h2>Hương vị gắn kết<br>mỗi cuộc gặp.</h2><div class="stroke"></div><p>RIEU VIỆT giới thiệu các set lẩu riêu, lẩu gà nấm, lẩu hải sản, lẩu bò Tứ Xuyên, lẩu cá và các món nhúng, món ăn kèm theo thực đơn hiện có của quán.</p><p>Website giúp thực khách xem trước món ăn, giá tham khảo và chuẩn bị nội dung đặt bàn trước khi liên hệ nhà hàng xác nhận.</p><a href="/thuc-don.html" class="btn outline">KHÁM PHÁ THỰC ĐƠN</a></div></div></section>'''
(ROOT/'gioi-thieu.html').write_text(page('Giới thiệu','Giới thiệu RIEU VIỆT — nhà hàng lẩu riêu và ẩm thực Việt, xem thực đơn và lựa chọn món lẩu cho bữa ăn sum họp.','gioi-thieu',about,'/gioi-thieu'),encoding='utf-8')
(ROOT/'lien-he.html').write_text(page('Liên hệ','Liên hệ nhà hàng Lẩu Riêu Việt để hỏi thông tin thực đơn, đặt bàn và địa chỉ quán.', 'lien-he',contact,'/lien-he'),encoding='utf-8')

policies={
'chinh-sach-thanh-toan':('Chính sách thanh toán','Thông tin hình thức thanh toán và nguyên tắc xác nhận đơn của RIEU VIỆT',[
 ('1. Phạm vi thanh toán','Website rieuviet.com cung cấp thông tin món ăn và giá tham khảo theo thực đơn. Yêu cầu đặt bàn hoặc chọn món qua giao diện chưa mặc nhiên tạo thành đơn hàng đã được nhà hàng xác nhận.'),
 ('2. Giá và xác nhận đơn','Giá được hiển thị bằng đồng Việt Nam (VNĐ). Nhà hàng sẽ xác nhận món, số lượng, tổng tiền và phương thức thanh toán áp dụng tại thời điểm phục vụ hoặc khi liên hệ trực tiếp. Nếu có sai khác so với giá trên website, khách hàng có quyền không xác nhận yêu cầu.'),
 ('3. Phương thức thanh toán','Hiện tại website chưa kích hoạt thu tiền bằng thẻ quốc tế. Khách hàng chỉ thanh toán theo phương thức được nhà hàng xác nhận trực tiếp. Không chuyển tiền cho tài khoản hoặc đường dẫn lạ không được nhà hàng xác minh.'),
 ('4. Thanh toán thẻ qua SePay','Hình thức thanh toán thẻ Visa/Mastercard/JCB (nếu được SePay phê duyệt) chỉ xuất hiện sau khi hệ thống tích hợp và vận hành chính thức. Website không thu thập, lưu hoặc xử lý trực tiếp số thẻ, mã CVV/CVC.'),
 ('5. Chứng từ và hỗ trợ','Nếu cần chứng từ/hóa đơn, khách hàng vui lòng đề nghị nhà hàng khi thanh toán và cung cấp thông tin hợp lệ. Tranh chấp thanh toán cần được giải quyết qua kênh liên hệ chính thức của nhà hàng.')]),
'chinh-sach-hoan-huy':('Chính sách hoàn / hủy','Quy trình xử lý yêu cầu hủy bàn, đổi món và hoàn tiền',[
 ('1. Hủy yêu cầu chưa xác nhận','Phiếu đặt bàn hoặc danh sách món được tạo trên website chỉ dùng để khách hàng sao chép và liên hệ nhà hàng. Nếu chưa được nhà hàng xác nhận, phiếu này không phát sinh nghĩa vụ thanh toán hay phí hủy.'),
 ('2. Thay đổi hoặc hủy đơn đã xác nhận','Khách hàng liên hệ nhà hàng sớm nhất có thể. Việc đổi hoặc hủy món, bàn, suất ăn đã chuẩn bị được xem xét theo tiến độ chế biến và thỏa thuận thực tế khi xác nhận đơn.'),
 ('3. Hoàn tiền','Với các khoản đã thanh toán trước (nếu có), nhà hàng sẽ kiểm tra giao dịch, tình trạng cung ứng và thỏa thuận với khách hàng trước khi xử lý. Tiền hoàn được thực hiện qua phương thức hợp lệ và thời gian nhận tiền phụ thuộc ngân hàng hoặc đơn vị thanh toán.'),
 ('4. Sự cố khi phục vụ','Nếu món không đúng yêu cầu đã được xác nhận, chất lượng có vấn đề hoặc giao dịch trùng lặp, khách hàng vui lòng báo ngay để nhà hàng kiểm tra và xử lý phù hợp.'),
 ('5. Kênh tiếp nhận','Vui lòng dùng điện thoại, email hoặc địa chỉ chính thức trên trang Liên hệ. Nhà hàng cần công khai thông tin liên hệ chính xác trước khi nhận đặt bàn hoặc thanh toán trực tuyến.')]),
'chinh-sach-giao-nhan':('Chính sách giao nhận','Thông tin cách phục vụ món ăn và xác nhận thời gian nhận món',[
 ('1. Hình thức phục vụ','Website hiện giới thiệu thực đơn và hỗ trợ khách chuẩn bị nội dung đặt bàn, đặt trước món để thưởng thức tại nhà hàng. Chưa có dịch vụ giao hàng trực tuyến tự động trên website.'),
 ('2. Xác nhận thời gian','Thời gian và địa điểm phục vụ cần được nhân viên nhà hàng xác nhận trực tiếp qua kênh liên hệ chính thức. Khách hàng không nên coi việc sao chép phiếu yêu cầu trên website là xác nhận bàn hoặc giao món.'),
 ('3. Đóng gói, mang về hoặc giao ngoài','Nếu nhà hàng có nhận đơn mang về hoặc giao hàng theo từng thời điểm, chi phí và điều kiện thực hiện phải được xác nhận rõ trước khi khách hàng đồng ý đặt món.'),
 ('4. Kiểm tra món','Khách hàng vui lòng kiểm tra món, số lượng và hóa đơn khi nhận món; liên hệ nhân viên ngay nếu có bất kỳ sai sót nào.')]),
'chinh-sach-bao-mat':('Chính sách bảo mật','Thông tin về dữ liệu và quyền riêng tư khi sử dụng rieuviet.com',[
 ('1. Dữ liệu được sử dụng','Website cho phép khách chọn món và chuẩn bị thông tin đặt bàn. Ở phiên bản hiện tại, danh sách món được lưu trong bộ nhớ trình duyệt (localStorage) trên thiết bị của khách để ghi nhớ lựa chọn; website chưa gửi phiếu đặt bàn hoặc thông tin khách hàng lên hệ thống máy chủ.'),
 ('2. Thông tin khách chủ động cung cấp','Tên, số điện thoại và ghi chú chỉ được dùng để tạo nội dung yêu cầu mà khách có thể sao chép và tự gửi cho nhà hàng qua kênh liên hệ chính thức. Khi khách gửi tin qua các ứng dụng bên ngoài, chính sách dữ liệu của ứng dụng đó cũng có thể áp dụng.'),
 ('3. Thanh toán và dữ liệu thẻ','Website không thu thập số thẻ ngân hàng, ngày hết hạn hoặc mã CVV/CVC. Nếu tích hợp cổng thanh toán trong tương lai, các thông tin nhạy cảm sẽ được nhập và xử lý qua môi trường bảo mật của đơn vị thanh toán được cấp phép.'),
 ('4. Cookies và nội dung bên thứ ba','Website có thể tải phông chữ từ Google Fonts. Bên cung cấp dịch vụ này có thể xử lý dữ liệu kết nối theo chính sách riêng. Không sử dụng công cụ theo dõi quảng cáo trong bộ mã hiện tại.'),
 ('5. Cách xóa dữ liệu đã lưu','Khách hàng có thể xóa món đã chọn trong giỏ, hoặc xóa dữ liệu website trong trình duyệt để xóa dữ liệu localStorage.'),
 ('6. Liên hệ về quyền riêng tư','Mọi thắc mắc về dữ liệu có thể gửi theo số điện thoại hoặc email chính thức công bố trên trang Liên hệ. Chính sách phải được cập nhật nếu website bổ sung đặt hàng trực tuyến hoặc thanh toán thực tế.')]),
'dieu-khoan-su-dung':('Điều khoản sử dụng','Điều kiện truy cập, sử dụng thông tin và đặt món tại rieuviet.com',[
 ('1. Chủ thể website','rieuviet.com là website giới thiệu nhà hàng RIEU VIỆT. Tên pháp lý, mã số thuế và thông tin liên hệ của đơn vị vận hành phải được chủ sở hữu khai báo đúng và công bố trên website.'),
 ('2. Thông tin thực đơn','Hình ảnh món ăn và giá bán được tham chiếu từ menu do nhà hàng cung cấp. Thông tin có thể được cập nhật theo thực tế; giá và tình trạng phục vụ cuối cùng cần được nhân viên xác nhận trực tiếp.'),
 ('3. Yêu cầu đặt bàn / chọn món','Chức năng chọn món và tạo phiếu trên website là công cụ hỗ trợ; không tự gửi yêu cầu cho nhà hàng và không có giá trị xác nhận đơn, giữ chỗ hoặc thanh toán.'),
 ('4. Nghĩa vụ người dùng','Khách truy cập cần cung cấp thông tin liên lạc chính xác khi liên hệ nhà hàng và không sử dụng website cho mục đích gây gián đoạn dịch vụ hoặc vi phạm pháp luật.'),
 ('5. Quyền sử dụng nội dung','Hình ảnh thực đơn do nhà hàng cung cấp và nội dung thương hiệu chỉ được sử dụng phù hợp với quyền của chủ sở hữu. Không được tự ý giả mạo website hoặc kênh thanh toán.'),
 ('6. Điều chỉnh điều khoản','Website có thể được cập nhật khi có thay đổi thực đơn, phương thức phục vụ hoặc quy trình thanh toán. Những thay đổi quan trọng phải được công bố rõ ràng trước khi áp dụng.')])
}
for slug,(title,desc,items) in policies.items():
 prose=''.join(f'<h2>{h}</h2><p>{content}</p>' for h,content in items)
 if slug=='chinh-sach-thanh-toan': prose+='<div class="note"><b>Trạng thái hiện tại:</b> <span data-config="onlinePayment"></span></div>'
 prose+='<h2>Thông tin liên hệ</h2><p>Đơn vị kinh doanh: <span data-config="legalName"></span><br>Mã số thuế: <span data-config="taxCode"></span><br>Địa chỉ: <span data-config="address"></span><br>Điện thoại: <span data-config="phone"></span><br>Email: <span data-config="email"></span></p>'
 body=pagehero('CHÍNH SÁCH RIEU VIỆT',title,desc)+f'<section class="section"><div class="container"><article class="prose">{prose}<p><a class="text-link" href="/lien-he.html">Liên hệ RIEU VIỆT</a></p></article></div></section>'
 (ROOT/f'{slug}.html').write_text(page(title,desc,'',body,f'/{slug}'),encoding='utf-8')
print('Generated',len(list(ROOT.glob('*.html'))),'HTML pages')
