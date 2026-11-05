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
        '<div class="contact-strip"><div class="contact-tile"><b>Địa chỉ nhà hàng</b><p data-config="address">Số 01 Hàn Mạc Tử, Phường Kinh Bắc, Bắc Ninh, Việt Nam</p><a class="text-link" data-link="map" href="https://share.google/Sk8WSTpvcjp1EKxP2" target="_blank" rel="noopener noreferrer" style="margin-top:11px">Xem vị trí / liên hệ quán</a></div>'
        '<div class="contact-tile"><b>Điện thoại</b><p><span data-config="phone"><a href="tel:0859433333">0859 433 333</a> &nbsp;·&nbsp; <a href="tel:0814133333">0814 133 333</a></span></p><p>Đặt bàn và xác nhận món vui lòng liên hệ trực tiếp.</p></div>'
        '<div class="contact-tile"><b>Email</b><p><a data-link="email" data-config="email" href="mailto:marketing.rieuviet@gmail.com">marketing.rieuviet@gmail.com</a></p></div>'
        '<div class="contact-tile"><b>Giờ mở cửa</b><p data-config="openingHours">10:00 – 22:30, tất cả các ngày</p></div></div>'
        '</div></section>'
    )
    return hero + body
