/* Sửa các trường bên dưới đúng theo giấy phép kinh doanh và thông tin quán.
   Không tự thêm tên công ty, MST, số điện thoại hay địa chỉ chưa xác minh. */
window.RIEU_CONFIG = {
  brand: 'RIEU VIỆT',
  tagline: 'Đậm đà hương Việt',
  domain: 'https://rieuviet.com',
  legalName: '',
  taxCode: '',
  address: '',
  phone: '', // Dùng 0xxxxxxxxx, không có khoảng trắng
  email: '',
  openingHours: '', // VD: '10:00 – 22:00, tất cả các ngày'
  mapUrl: '', // URL chia sẻ của Google Maps nếu có
  facebookUrl: '',
  zaloUrl: '',
  // Không đổi thành true cho đến khi SePay chính thức kích hoạt merchant và có backend xác minh IPN.
  onlinePaymentEnabled: false
};
