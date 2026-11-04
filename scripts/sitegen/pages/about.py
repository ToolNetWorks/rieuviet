"""
About page content template.
"""
from ..templates import pagehero

def get_about_content():
    hero = pagehero(
        'VỀ THƯƠNG HIỆU',
        'Chuyện của RIEU VIỆT',
        'Không gian ẩm thực mang tên RIEU VIỆT, lấy các món lẩu và món ăn Việt làm trung tâm của bữa ăn sum họp.'
    )
    body = (
        '<section class="section"><div class="container story"><div class="story-art">'
        '<img src="/assets/images/lau-rieu-350.webp" alt="Set lẩu riêu Việt 350K" loading="lazy">'
        '<img src="/assets/images/lau-rieu-550.webp" alt="Set lẩu riêu Việt 550K" loading="lazy">'
        '</div><div class="story-copy"><div class="eyebrow">RIEU VIỆT · ĐẬM ĐÀ HƯƠNG VIỆT</div>'
        '<h2>Hương vị gắn kết<br>mỗi cuộc gặp.</h2><div class="stroke"></div>'
        '<p>RIEU VIỆT giới thiệu các set lẩu riêu, lẩu gà nấm, lẩu hải sản, lẩu bò Tứ Xuyên, lẩu cá và các món nhúng, món ăn kèm theo thực đơn hiện có của quán.</p>'
        '<p>Website giúp thực khách xem trước món ăn, giá tham khảo và chuẩn bị nội dung đặt bàn trước khi liên hệ nhà hàng xác nhận.</p>'
        '<a href="/thuc-don.html" class="btn outline">KHÁM PHÁ THỰC ĐƠN</a></div></div></section>'
    )
    return hero + body
