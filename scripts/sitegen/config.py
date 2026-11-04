"""
Site generator configuration, metadata, and asset versioning.
"""
from pathlib import Path
import hashlib

ROOT = Path(__file__).resolve().parents[2]

def asset_hash(rel_path):
    p = ROOT / rel_path
    if p.is_file():
        return hashlib.md5(p.read_bytes()).hexdigest()[:8]
    return '1'

def get_asset_versions():
    return {
        'css': asset_hash('assets/styles.css'),
        'config': asset_hash('assets/config.js'),
        'menu_data': asset_hash('assets/menu-data.js'),
        'site': asset_hash('assets/site.js'),
    }

LINKS = [
    ('Trang chủ', '/', 'index'),
    ('Thực đơn', '/thuc-don.html', 'thuc-don'),
    ('Giới thiệu', '/gioi-thieu.html', 'gioi-thieu'),
    ('Liên hệ', '/lien-he.html', 'lien-he'),
]

POLICIES = [
    ('Thanh toán', '/chinh-sach-thanh-toan.html'),
    ('Hoàn / hủy', '/chinh-sach-hoan-huy.html'),
    ('Giao nhận', '/chinh-sach-giao-nhan.html'),
    ('Bảo mật', '/chinh-sach-bao-mat.html'),
    ('Điều khoản', '/dieu-khoan-su-dung.html'),
]

EMBLEM = '<svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true"><path d="M7 23h26c0 9-6 14-13 14S7 32 7 23Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 23h32M15 18c-4-5 4-7 1-13m9 13c-4-5 4-7 1-13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>'

CART_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h2l2.1 10.5h10.8L21 9H7M9 21h.01M18 21h.01"/></svg>'
