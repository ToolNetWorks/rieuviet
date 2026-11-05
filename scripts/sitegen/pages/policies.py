"""
Policy pages definitions and content generator.
"""
from ..templates import pagehero

POLICIES_DATA = {
    'chinh-sach-thanh-toan': (
        'Chính sách thanh toán',
        'Thông tin hình thức thanh toán và nguyên tắc xác nhận đơn của RIEU VIỆT',
        [
            ('1. Phạm vi thanh toán', 'Website rieuviet.vn cung cấp thông tin món ăn và giá tham khảo theo thực đơn. Yêu cầu đặt bàn hoặc chọn món qua giao diện chưa mặc nhiên tạo thành đơn hàng đã được nhà hàng xác nhận.'),
            ('2. Giá và xác nhận đơn', 'Giá được hiển thị bằng đồng Việt Nam (VNĐ). Nhà hàng sẽ xác nhận món, số lượng, tổng tiền và phương thức thanh toán áp dụng tại thời điểm phục vụ hoặc khi liên hệ trực tiếp. Nếu có sai khác so với giá trên website, khách hàng có quyền không xác nhận yêu cầu.'),
            ('3. Phương thức thanh toán', 'Hiện tại website chưa kích hoạt thu tiền bằng thẻ quốc tế. Khách hàng chỉ thanh toán theo phương thức được nhà hàng xác nhận trực tiếp. Không chuyển tiền cho tài khoản hoặc đường dẫn lạ không được nhà hàng xác minh.'),
            ('4. Thanh toán thẻ qua SePay', 'Hình thức thanh toán thẻ Visa/Mastercard/JCB (nếu được SePay phê duyệt) chỉ xuất hiện sau khi hệ thống tích hợp và vận hành chính thức. Website không thu thập, lưu hoặc xử lý trực tiếp số thẻ, mã CVV/CVC.'),
            ('5. Chứng từ và hỗ trợ', 'Nếu cần chứng từ/hóa đơn, khách hàng vui lòng đề nghị nhà hàng khi thanh toán và cung cấp thông tin hợp lệ. Tranh chấp thanh toán cần được giải quyết qua kênh liên hệ chính thức của nhà hàng.')
        ]
    ),
    'chinh-sach-hoan-huy': (
        'Chính sách hoàn / hủy',
        'Quy trình xử lý yêu cầu hủy bàn, đổi món và hoàn tiền',
        [
            ('1. Hủy yêu cầu chưa xác nhận', 'Phiếu đặt bàn hoặc danh sách món được tạo trên website chỉ dùng để khách hàng sao chép và liên hệ nhà hàng. Nếu chưa được nhà hàng xác nhận, phiếu này không phát sinh nghĩa vụ thanh toán hay phí hủy.'),
            ('2. Thay đổi hoặc hủy đơn đã xác nhận', 'Khách hàng liên hệ nhà hàng sớm nhất có thể. Việc đổi hoặc hủy món, bàn, suất ăn đã chuẩn bị được xem xét theo tiến độ chế biến và thỏa thuận thực tế khi xác nhận đơn.'),
            ('3. Hoàn tiền', 'Với các khoản đã thanh toán trước (nếu có), nhà hàng sẽ kiểm tra giao dịch, tình trạng cung ứng và thỏa thuận với khách hàng trước khi xử lý. Tiền hoàn được thực hiện qua phương thức hợp lệ và thời gian nhận tiền phụ thuộc ngân hàng hoặc đơn vị thanh toán.'),
            ('4. Sự cố khi phục vụ', 'Nếu món không đúng yêu cầu đã được xác nhận, chất lượng có vấn đề hoặc giao dịch trùng lặp, khách hàng vui lòng báo ngay để nhà hàng kiểm tra và xử lý phù hợp.'),
            ('5. Kênh tiếp nhận', 'Vui lòng dùng điện thoại, email hoặc địa chỉ chính thức trên trang Liên hệ. Nhà hàng cần công khai thông tin liên hệ chính xác trước khi nhận đặt bàn hoặc thanh toán trực tuyến.')
        ]
    ),
    'chinh-sach-giao-nhan': (
        'Chính sách giao nhận',
        'Thông tin cách phục vụ món ăn và xác nhận thời gian nhận món',
        [
            ('1. Hình thức phục vụ', 'Website hiện giới thiệu thực đơn và hỗ trợ khách chuẩn bị nội dung đặt bàn, đặt trước món để thưởng thức tại nhà hàng. Chưa có dịch vụ giao hàng trực tuyến tự động trên website.'),
            ('2. Xác nhận thời gian', 'Thời gian và địa điểm phục vụ cần được nhân viên nhà hàng xác nhận trực tiếp qua kênh liên hệ chính thức. Khách hàng không nên coi việc sao chép phiếu yêu cầu trên website là xác nhận bàn hoặc giao món.'),
            ('3. Đóng gói, mang về hoặc giao ngoài', 'Nếu nhà hàng có nhận đơn mang về hoặc giao hàng theo từng thời điểm, chi phí và điều kiện thực hiện phải được xác nhận rõ trước khi khách hàng đồng ý đặt món.'),
            ('4. Kiểm tra món', 'Khách hàng vui lòng kiểm tra món, số lượng và hóa đơn khi nhận món; liên hệ nhân viên ngay nếu có bất kỳ sai sót nào.')
        ]
    ),
    'chinh-sach-bao-mat': (
        'Chính sách bảo mật',
        'Thông tin về dữ liệu và quyền riêng tư khi sử dụng rieuviet.vn',
        [
            ('1. Dữ liệu được sử dụng', 'Website cho phép khách chọn món và chuẩn bị thông tin đặt bàn. Ở phiên bản hiện tại, danh sách món được lưu trong bộ nhớ trình duyệt (localStorage) trên thiết bị của khách để ghi nhớ lựa chọn; website chưa gửi phiếu đặt bàn hoặc thông tin khách hàng lên hệ thống máy chủ.'),
            ('2. Thông tin khách chủ động cung cấp', 'Tên, số điện thoại và ghi chú chỉ được dùng để tạo nội dung yêu cầu mà khách có thể sao chép và tự gửi cho nhà hàng qua kênh liên hệ chính thức. Khi khách gửi tin qua các ứng dụng bên ngoài, chính sách dữ liệu của ứng dụng đó cũng có thể áp dụng.'),
            ('3. Thanh toán và dữ liệu thẻ', 'Website không thu thập số thẻ ngân hàng, ngày hết hạn hoặc mã CVV/CVC. Nếu tích hợp cổng thanh toán trong tương lai, các thông tin nhạy cảm sẽ được nhập và xử lý qua môi trường bảo mật của đơn vị thanh toán được cấp phép.'),
            ('4. Cookies và nội dung bên thứ ba', 'Website có thể tải phông chữ từ Google Fonts. Bên cung cấp dịch vụ này có thể xử lý dữ liệu kết nối theo chính sách riêng. Không sử dụng công cụ theo dõi quảng cáo trong bộ mã hiện tại.'),
            ('5. Cách xóa dữ liệu đã lưu', 'Khách hàng có thể xóa món đã chọn trong giỏ, hoặc xóa dữ liệu website trong trình duyệt để xóa dữ liệu localStorage.'),
            ('6. Liên hệ về quyền riêng tư', 'Mọi thắc mắc về dữ liệu có thể gửi theo số điện thoại hoặc email chính thức công bố trên trang Liên hệ. Chính sách phải được cập nhật nếu website bổ sung đặt hàng trực tuyến hoặc thanh toán thực tế.')
        ]
    ),
    'dieu-khoan-su-dung': (
        'Điều khoản sử dụng',
        'Điều kiện truy cập, sử dụng thông tin và đặt món tại rieuviet.vn',
        [
            ('1. Chủ thể website', 'rieuviet.vn là website giới thiệu nhà hàng RIEU VIỆT. Tên pháp lý, mã số thuế và thông tin liên hệ của đơn vị vận hành phải được chủ sở hữu khai báo đúng và công bố trên website.'),
            ('2. Thông tin thực đơn', 'Hình ảnh món ăn và giá bán được tham chiếu từ menu do nhà hàng cung cấp. Thông tin có thể được cập nhật theo thực tế; giá và tình trạng phục vụ cuối cùng cần được nhân viên xác nhận trực tiếp.'),
            ('3. Yêu cầu đặt bàn / chọn món', 'Chức năng chọn món và tạo phiếu trên website là công cụ hỗ trợ; không tự gửi yêu cầu cho nhà hàng và không có giá trị xác nhận đơn, giữ chỗ hoặc thanh toán.'),
            ('4. Nghĩa vụ người dùng', 'Khách truy cập cần cung cấp thông tin liên lạc chính xác khi liên hệ nhà hàng và không sử dụng website cho mục đích gây gián đoạn dịch vụ hoặc vi phạm pháp luật.'),
            ('5. Quyền sử dụng nội dung', 'Hình ảnh thực đơn do nhà hàng cung cấp và nội dung thương hiệu chỉ được sử dụng phù hợp với quyền của chủ sở hữu. Không được tự ý giả mạo website hoặc kênh thanh toán.'),
            ('6. Điều chỉnh điều khoản', 'Website có thể được cập nhật khi có thay đổi thực đơn, phương thức phục vụ hoặc quy trình thanh toán. Những thay đổi quan trọng phải được công bố rõ ràng trước khi áp dụng.')
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
