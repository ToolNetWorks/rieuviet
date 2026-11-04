# RIEU VIỆT — rieuviet.com

Website nhà hàng lẩu riêu, thiết kế tối ưu cho mobile và máy tính. Phiên bản v1.0 (04/11/2026).

## Đã có

- Trang chủ: giới thiệu lẩu riêu, các set chính và món ăn nổi bật.
- Giới thiệu, thực đơn (lọc theo loại và tìm kiếm không dấu), liên hệ.
- Giỏ chọn món: tăng/giảm số lượng, tổng tiền theo menu, lưu bằng `localStorage`.
- Form đặt bàn và phiếu đặt trước món: **sao chép nội dung để khách liên hệ quán**, không giả xác nhận.
- 5 trang chính sách: thanh toán, hoàn/hủy, giao nhận, bảo mật, điều khoản.
- 15 trang thực đơn từ file `Menu.pdf` do chủ quán cung cấp, đã nén thành `thuc-don-rieu-viet.pdf` (~3,75 MB).
- SEO cơ bản: title/description, canonical, OpenGraph, JSON-LD Restaurant, sitemap, robots.
- Responsive và tối ưu tải ảnh WebP. Không có giao diện nhập số thẻ/CVV tự xây dựng.

## CẦN LÀM TRƯỚC KHI CÔNG BỐ / GỬI SEPAY DUYỆT

**Bắt buộc:** mở `assets/config.js` rồi nhập thông tin THẬT, khớp hồ sơ thương nhân đã nộp:

```js
window.RIEU_CONFIG = {
  brand: 'RIEU VIỆT',
  tagline: 'Đậm đà hương Việt',
  domain: 'https://rieuviet.com',
  legalName: 'TÊN CÔNG TY/HỘ KINH DOANH ĐÚNG GIẤY PHÉP',
  taxCode: 'MÃ SỐ THUẾ THẬT',
  address: 'ĐỊA CHỈ QUÁN ĐẦY ĐỦ',
  phone: 'SỐ ĐIỆN THOẠI THẬT',
  email: 'EMAIL TIẾP NHẬN KHÁCH HÀNG',
  openingHours: 'GIỜ MỞ CỬA THỰC TẾ',
  mapUrl: 'GOOGLE MAPS URL',
  facebookUrl: '',
  zaloUrl: '',
  onlinePaymentEnabled: false
};
```

Sửa/đọc lại các trang chính sách cho khớp hoạt động thực tế của quán. Kiểm tra tính chính xác, nguồn gốc và tính hợp pháp của các món đặc thù trong PDF (trong đó có món từ động vật hoang dã) trước khi đăng công khai. Không tự điền thông tin pháp lý giả hoặc đưa ra cam kết không có thật.

**Giới hạn tính năng:** Đây là website giới thiệu, xem menu và tạo phiếu yêu cầu. Form KHÔNG tự gửi đặt bàn/đơn hàng lên máy chủ. Để nhận và xác nhận đơn online cần bổ sung backend, thông báo trạng thái và quy trình nhân viên. Thanh toán thẻ Visa/Mastercard/JCB chưa tích hợp; chỉ bật sau khi SePay duyệt merchant và triển khai API tạo đơn + xác minh IPN ở backend. Việc tạo website không đảm bảo SePay phê duyệt hồ sơ.

## Xem thử trên máy tính/VPS

```bash
cd rieuviet-site
python3 -m http.server 8000
```

Truy cập `http://localhost:8000`. Có thể dùng bất kỳ web server tĩnh nào.

## Đưa lên Vercel

Phương án đơn giản: tạo repo GitHub cho thư mục này (giữ cả `index.html` và thư mục `assets/`), vào Vercel → Add New → Project → Import Git Repository. Chọn dự án **Other** / không chọn framework, để trống Build Command và Output Directory. Sau deploy thử domain mặc định `*.vercel.app`, sau đó vào Project → Settings → Domains, thêm `rieuviet.com` và làm theo hướng dẫn bản ghi DNS của Vercel. Kiểm tra cả `www.rieuviet.com` theo cấu hình thực tế.

Nếu dùng Vercel CLI (khi đã đăng nhập):

```bash
cd rieuviet-site
npx vercel --prod
```

Không nên dùng tên miền chính thức nếu đang có website thật chưa sao lưu. Thay đổi DNS sẽ điều hướng tên miền tới deployment mới.

## Cập nhật menu

- Dữ liệu món/giá: `assets/menu-data.js`.
- Trang gốc 15 ảnh: `assets/images/menu-page-01.webp` ... `menu-page-15.webp`.
- PDF đã tối ưu: `thuc-don-rieu-viet.pdf`.
- Nếu cần tạo lại ảnh từ menu gốc, đặt file `Menu.pdf` cạnh `create_assets.py`, chạy `python3 create_assets.py` (yêu cầu `pymupdf` và `Pillow`).
- Trang HTML được tạo từ `build_pages.py`; chỉ cần chạy `python3 build_pages.py` nếu thay nội dung tĩnh bằng file này.

## Kiểm tra

```bash
python3 tests/check_site.py
node --check assets/site.js
node --check assets/menu-data.js
```

## Lưu ý bảo mật và thanh toán

- Không gửi dữ liệu thẻ qua form tự viết, không lưu CVV.
- Không coi callback trình duyệt là bằng chứng đã thanh toán; backend cần kiểm tra IPN, chữ ký, số tiền và mã đơn trước khi ghi nhận thanh toán.
- Không công khai Merchant Secret/SePay API Key trong `assets/config.js` hoặc bất kỳ file `.js` nào thuộc frontend.
- Cập nhật chính sách bảo mật khi bổ sung tính năng thu thập dữ liệu, đặt hàng hoặc cổng thanh toán thật.
