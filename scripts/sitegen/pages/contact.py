"""
Contact page content template.
"""
from ..templates import pagehero

def get_contact_content():
    hero = pagehero(
        'CHÚNG TÔI Ở ĐÂY',
        'Liên hệ RIEU VIỆT',
        'Thông tin kết nối với nhà hàng, giờ phục vụ và hướng dẫn liên hệ đặt bàn.'
    )
    body = (
        '<section class="section"><div class="container"><div class="section-heading"><div class="eyebrow">RIEU VIỆT · ĐẬM ĐÀ HƯƠNG VIỆT</div>'
        '<h2>Hẹn bạn tại quán</h2><p>Liên hệ trực tiếp để xác nhận bàn trống, món ăn và giờ phục vụ.</p></div>'
        '<div class="contact-strip"><div class="contact-tile"><b>Địa chỉ nhà hàng</b><p data-config="address"></p><a class="text-link" data-link="map" href="/lien-he.html" style="margin-top:11px">Xem vị trí / liên hệ quán</a></div>'
        '<div class="contact-tile"><b>Điện thoại</b><p><a data-link="phone" data-config="phone" href="/lien-he.html"></a></p><p>Đặt bàn và xác nhận món vui lòng liên hệ trực tiếp.</p></div>'
        '<div class="contact-tile"><b>Email</b><p><a data-link="email" data-config="email" href="/lien-he.html"></a></p></div>'
        '<div class="contact-tile"><b>Giờ mở cửa</b><p data-config="openingHours"></p></div></div>'
        '<div class="notice" style="margin-top:35px">Thông tin pháp lý, địa chỉ, số điện thoại và giờ phục vụ cần được chủ quán cập nhật chính xác trước khi công bố website hoặc gửi SePay xét duyệt.</div></div></section>'
    )
    return hero + body
