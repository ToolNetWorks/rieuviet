"""
Policy pages definitions and content generator.
"""
from ..templates import pagehero

POLICIES_DATA = {
    'chinh-sach-thanh-toan': (
        'Chính sách thanh toán',
        'Thông tin hình thức thanh toán và nguyên tắc phục vụ của RIEU VIỆT',
        [
            ('1. Phạm vi thanh toán', 'Website rieuviet.vn cung cấp thông tin thực đơn và giá niêm yết chính thức của RIEU VIỆT. Sau khi nhận yêu cầu đặt bàn hoặc đặt món, nhân viên nhà hàng sẽ liên hệ xác nhận trực tiếp với quý khách.'),
            ('2. Giá và xác nhận đơn', 'Giá được hiển thị bằng đồng Việt Nam (VNĐ). Nhà hàng sẽ xác nhận món, số lượng, tổng tiền và phương thức thanh toán áp dụng tại thời điểm phục vụ hoặc khi liên hệ trực tiếp.'),
            ('3. Phương thức thanh toán', 'Khách hàng thanh toán trực tiếp tại nhà hàng bằng tiền mặt hoặc chuyển khoản theo thông tin chính thức do nhân viên cung cấp. Không chuyển tiền cho bất kỳ tài khoản hoặc đường dẫn lạ không được nhà hàng xác minh.'),
            ('4. Thanh toán thẻ trực tuyến', 'Hình thức thanh toán thẻ Visa/Mastercard/JCB chỉ áp dụng khi hệ thống thanh toán trực tuyến được thông báo chính thức. Website không bao giờ thu thập, lưu trữ hay yêu cầu cung cấp thông tin thẻ hoặc mã bảo mật CVV/CVC của quý khách.'),
            ('5. Chứng từ và hỗ trợ', 'Nếu cần hóa đơn giá trị gia tăng (VAT), quý khách vui lòng thông báo cho nhân viên khi thanh toán và cung cấp thông tin xuất hóa đơn hợp lệ.')
        ]
    ),
    'chinh-sach-hoan-huy': (
        'Chính sách hoàn / hủy',
        'Quy trình hỗ trợ thay đổi lịch hẹn, hủy bàn và xử lý hoàn tiền',
        [
            ('1. Hủy yêu cầu chưa xác nhận', 'Yêu cầu đặt bàn hoặc danh sách món gửi qua website chỉ có hiệu lực khi nhà hàng đã liên hệ xác nhận với quý khách. Khi chưa xác nhận, yêu cầu hoàn toàn không phát sinh nghĩa vụ thanh toán hay phí hủy.'),
            ('2. Thay đổi hoặc hủy đặt bàn', 'Trường hợp có thay đổi về thời gian hoặc số lượng khách, quý khách vui lòng liên hệ sớm với nhà hàng qua hotline để nhân viên kịp thời điều chỉnh và phục vụ chu đáo nhất.'),
            ('3. Hoàn tiền', 'Đối với các khoản đặt cọc hoặc thanh toán trước cho sự kiện/tiệc lớn (nếu có), nhà hàng sẽ trao đổi và thống nhất phương án hoàn cọc phù hợp theo thỏa thuận thực tế.'),
            ('4. Phản ánh chất lượng phục vụ', 'Nếu món ăn không đúng yêu cầu đã xác nhận hoặc có bất kỳ vấn đề gì về dịch vụ, quý khách vui lòng báo ngay cho quản lý nhà hàng để được kiểm tra và xử lý thỏa đáng.'),
            ('5. Kênh tiếp nhận', 'Quý khách vui lòng liên hệ hotline, email hoặc trực tiếp tại nhà hàng theo thông tin trên trang Liên hệ để được hỗ trợ nhanh chóng.')
        ]
    ),
    'chinh-sach-giao-nhan': (
        'Chính sách giao nhận',
        'Thông tin hình thức phục vụ và thưởng thức món ăn tại RIEU VIỆT',
        [
            ('1. Hình thức phục vụ', 'RIEU VIỆT hân hạnh đón tiếp và phục vụ thực khách thưởng thức trực tiếp tại không gian nhà hàng. Trường hợp quý khách có nhu cầu đặt món mang về, vui lòng liên hệ trực tiếp để được chuẩn bị chu đáo.'),
            ('2. Xác nhận thời gian phục vụ', 'Thời gian đến và vị trí bàn được nhân viên nhà hàng xác nhận trực tiếp qua điện thoại để đảm bảo trải nghiệm ẩm thực trọn vẹn nhất.'),
            ('3. Đóng gói mang về', 'Nhà hàng hỗ trợ đóng gói đồ ăn mang về theo tiêu chuẩn an toàn vệ sinh thực phẩm, giữ trọn độ nóng sốt và hương vị món ăn.'),
            ('4. Kiểm tra món ăn', 'Quý khách vui lòng kiểm tra món ăn, số lượng và hóa đơn khi nhận món; thông báo ngay cho nhân viên nếu cần hỗ trợ thêm.')
        ]
    ),
    'chinh-sach-bao-mat': (
        'Chính sách bảo mật',
        'Cam kết bảo vệ thông tin và quyền riêng tư của khách hàng tại rieuviet.vn',
        [
            ('1. Dữ liệu khi duyệt web', 'Khi quý khách chọn món, danh sách món được ghi nhớ tạm thời trên thiết bị của quý khách để tiện theo dõi. Website không tự ý thu thập hay lưu trữ thông tin cá nhân của quý khách khi chưa có sự đồng ý.'),
            ('2. Thông tin khách hàng cung cấp', 'Thông tin họ tên, số điện thoại và ghi chú do quý khách cung cấp chỉ được dùng để liên hệ xác nhận đặt bàn và chuẩn bị món ăn chu đáo nhất.'),
            ('3. Dữ liệu thanh toán', 'Website không thu thập, không lưu trữ và không yêu cầu cung cấp số thẻ ngân hàng, ngày hết hạn hay mã CVV/CVC dưới mọi hình thức.'),
            ('4. An toàn dữ liệu', 'Website sử dụng kết nối mã hóa an toàn (HTTPS). RIEU VIỆT cam kết không chia sẻ hay cung cấp thông tin khách hàng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo thương mại.'),
            ('5. Quản lý thông tin', 'Quý khách có thể xóa món đã chọn trong giỏ bất cứ lúc nào, hoặc làm mới bộ nhớ trình duyệt để thiết lập lại dữ liệu.'),
            ('6. Liên hệ về quyền riêng tư', 'Mọi thắc mắc về chính sách bảo mật, quý khách vui lòng liên hệ theo số điện thoại hoặc email chính thức trên trang Liên hệ để được giải đáp kịp thời.')
        ]
    ),
    'dieu-khoan-su-dung': (
        'Điều khoản sử dụng',
        'Quy định sử dụng thông tin và tiện ích trực tuyến tại rieuviet.vn',
        [
            ('1. Chủ thể website', 'Website rieuviet.vn là kênh thông tin chính thức của Nhà hàng RIEU VIỆT. Toàn bộ thông tin pháp lý, mã số thuế và địa chỉ của đơn vị vận hành được niêm yết công khai tại chân trang.'),
            ('2. Thông tin thực đơn & giá', 'Hình ảnh món ăn và bảng giá được cập nhật theo thực đơn chính thức của RIEU VIỆT. Nhân viên nhà hàng sẽ xác nhận lại chi tiết món và bàn trống khi liên hệ với quý khách.'),
            ('3. Tiện ích chọn món và đặt bàn', 'Chức năng chọn món và đặt bàn trên website giúp quý khách lên kế hoạch trước cho bữa ăn. Yêu cầu đặt bàn sẽ được hoàn tất khi nhân viên nhà hàng liên hệ xác nhận trực tiếp.'),
            ('4. Trách nhiệm người dùng', 'Quý khách vui lòng cung cấp thông tin liên hệ chính xác để nhà hàng phục vụ kịp thời, đồng thời không sử dụng website vào các mục đích gây ảnh hưởng đến hệ thống.'),
            ('5. Bản quyền thương hiệu', 'Hình ảnh món ăn, thực đơn và nhận diện thương hiệu RIEU VIỆT thuộc quyền sở hữu của nhà hàng. Nghiêm cấm mọi hành vi sao chép trái phép hoặc giả mạo thương hiệu dưới mọi hình thức.'),
            ('6. Cập nhật điều khoản', 'Nội dung điều khoản có thể được điều chỉnh nhằm hoàn thiện chất lượng dịch vụ và được công bố công khai trên website.')
        ]
    )
}

def get_policy_content(slug):
    title, desc, items = POLICIES_DATA[slug]
    prose = ''.join(f'<h2>{h}</h2><p>{content}</p>' for h, content in items)
    if slug == 'chinh-sach-thanh-toan':
        prose += '<div class="note"><b>Trạng thái hiện tại:</b> <span data-config="onlinePayment"></span></div>'
    prose += (
        '<h2>Thông tin liên hệ</h2>'
        '<p>Đơn vị kinh doanh: <span data-config="legalName">CÔNG TY CỔ PHẦN DỊCH VỤ THƯƠNG MẠI RIÊU VIỆT</span><br>'
        'Mã số thuế: <span data-config="taxCode">2300954297</span><br>'
        'Địa chỉ: <span data-config="address">Số 01 Hàn Mạc Tử, Phường Kinh Bắc, Bắc Ninh, Việt Nam</span><br>'
        'Điện thoại: <span data-config="phone"><a href="tel:0859433333">0859 433 333</a> · <a href="tel:0814133333">0814 133 333</a></span><br>'
        'Email: <span data-config="email"><a href="mailto:marketing.rieuviet@gmail.com">marketing.rieuviet@gmail.com</a></span></p>'
    )
    hero = pagehero('CHÍNH SÁCH RIEU VIỆT', title, desc)
    body = (
        f'{hero}'
        f'<section class="section"><div class="container">'
        f'<article class="prose">{prose}<p><a class="text-link" href="/lien-he.html">Liên hệ RIEU VIỆT</a></p></article>'
        f'</div></section>'
    )
    return body
