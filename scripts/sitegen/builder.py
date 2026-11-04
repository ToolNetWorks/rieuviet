"""
Site generator orchestrator.
Generates all 9 production HTML pages with updated asset version hashes.
"""
from .config import ROOT, get_asset_versions
from .templates import page
from .pages.home import get_home_content
from .pages.menu import get_menu_content
from .pages.about import get_about_content
from .pages.contact import get_contact_content
from .pages.policies import POLICIES_DATA, get_policy_content

def build():
    versions = get_asset_versions()
    generated = []

    # 1. Home page
    home_html = page(
        'Trang chủ',
        'Khám phá thực đơn RIEU VIỆT — lẩu riêu set 350K, 450K, 550K, cùng nhiều món lẩu và món ăn kèm. Xem menu, bảng giá và thông tin đặt bàn.',
        'index',
        get_home_content(),
        '/',
        versions
    )
    (ROOT / 'index.html').write_text(home_html, encoding='utf-8')
    generated.append('index.html')

    # 2. Menu page
    menu_html = page(
        'Thực đơn & bảng giá',
        'Thực đơn Lẩu Riêu Việt gồm các set lẩu riêu 350K, 450K, 550K, lẩu hải sản, gà nấm, đồ nhúng và nhiều món ăn Việt. Xem đầy đủ 15 trang menu.',
        'thuc-don',
        get_menu_content(),
        '/thuc-don',
        versions
    )
    (ROOT / 'thuc-don.html').write_text(menu_html, encoding='utf-8')
    generated.append('thuc-don.html')

    # 3. About page
    about_html = page(
        'Giới thiệu',
        'Giới thiệu RIEU VIỆT — nhà hàng lẩu riêu và ẩm thực Việt, xem thực đơn và lựa chọn món lẩu cho bữa ăn sum họp.',
        'gioi-thieu',
        get_about_content(),
        '/gioi-thieu',
        versions
    )
    (ROOT / 'gioi-thieu.html').write_text(about_html, encoding='utf-8')
    generated.append('gioi-thieu.html')

    # 4. Contact page
    contact_html = page(
        'Liên hệ',
        'Liên hệ nhà hàng Lẩu Riêu Việt để hỏi thông tin thực đơn, đặt bàn và địa chỉ quán.',
        'lien-he',
        get_contact_content(),
        '/lien-he',
        versions
    )
    (ROOT / 'lien-he.html').write_text(contact_html, encoding='utf-8')
    generated.append('lien-he.html')

    # 5. Policy pages
    for slug, (title, desc, _) in POLICIES_DATA.items():
        policy_html = page(
            title,
            desc,
            '',
            get_policy_content(slug),
            f'/{slug}',
            versions
        )
        file_name = f'{slug}.html'
        (ROOT / file_name).write_text(policy_html, encoding='utf-8')
        generated.append(file_name)

    print(f'Successfully generated {len(generated)} HTML pages with asset versions:')
    for asset, v in versions.items():
        print(f'  - {asset}: ?v={v}')
    return len(generated)

if __name__ == '__main__':
    build()
