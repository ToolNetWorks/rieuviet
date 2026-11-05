"""
Menu and price list page content template.
"""
from ..templates import pagehero, menu_book

def get_menu_content():
    hero = pagehero(
        'THỰC ĐƠN RIEU VIỆT',
        'Chọn món trọn vị',
        'Tìm nhanh món yêu thích, xem thực đơn phong phú cùng bảng giá chính thức của RIEU VIỆT.'
    )
    fallback = (
        '<div style="display:flex;gap:22px;justify-content:center;align-items:center;flex-wrap:wrap">\n'
        '       <a class="text-link" href="/thuc-don-rieu-viet.pdf" download style="color:#f4cc98">Tải thực đơn PDF <span aria-hidden="true">↓</span></a>\n'
        '       <button type="button" class="text-link" data-open-zoom-all style="color:#f4cc98;background:none;border:none;cursor:pointer;font-size:inherit;font-family:inherit;padding:0;text-decoration:underline;text-underline-offset:4px">Xem toàn bộ 15 trang thực đơn <span aria-hidden="true">↗</span></button>\n'
        '     </div>'
    )
    book_section = (
        '<section class="section dark-feature" id="menu-goc">'
        '<div class="container">'
        '<div>'
        '<div class="eyebrow gold">THỰC ĐƠN NHÀ HÀNG</div>'
        '<h2>Xem menu gốc<br>15 trang.</h2>'
        '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:20px">'
        '<a class="btn light" href="/thuc-don-rieu-viet.pdf" download>TẢI THỰC ĐƠN PDF</a>'
        '<button class="btn outline" type="button" data-open-zoom-all>XEM TOÀN BỘ 15 TRANG</button>'
        '</div>'
        '</div>\n'
        + menu_book(fallback_html=fallback)
        + '</div></section>'
    )
    body = (
        '<section class="menu-tools"><div class="container"><div class="menu-tool-row"><div class="search-box"><span aria-hidden="true">⌕</span><input id="menu-search" type="search" autocomplete="off" aria-label="Tìm kiếm món ăn" placeholder="Tìm tên món, ví dụ: lẩu riêu, tôm, bò..."></div><div style="display:flex;gap:10px;align-items:center"><small class="muted" id="menu-result-count"></small><a class="text-link" href="#menu-goc">Xem menu gốc ↘</a></div></div><div id="category-list" class="category-list" aria-label="Lọc món theo nhóm"></div></div></section>\n'
        '<section class="section-sm"><div class="container"><div id="menu-list" class="menu-list" aria-live="polite"></div></div></section>\n'
        + book_section
    )
    return hero + body
