from html.parser import HTMLParser
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
expected_pages = [
    'index.html', 'gioi-thieu.html', 'thuc-don.html', 'lien-he.html',
    'chinh-sach-thanh-toan.html', 'chinh-sach-hoan-huy.html',
    'chinh-sach-giao-nhan.html', 'chinh-sach-bao-mat.html', 'dieu-khoan-su-dung.html'
]

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls=[]
        self.title=False
        self.description=False
        self.canonical=False
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag=='title':self.title=True
        if tag=='meta' and attrs.get('name')=='description':self.description=True
        if tag=='link' and attrs.get('rel')=='canonical':self.canonical=True
        for prop in ('href','src'):
            value=attrs.get(prop, '')
            if value.startswith('/') and value != '/': self.urls.append(value.split('#',1)[0].split('?',1)[0])

for file_name in expected_pages:
    f=root/file_name
    assert f.is_file(),f'Missing page: {file_name}'
    parser=PageParser()
    parser.feed(f.read_text(encoding='utf-8'))
    assert parser.title and parser.description and parser.canonical,file_name
    for path in parser.urls:
        if not path or path == '/':continue
        assert (root/path.lstrip('/')).is_file(),f'Broken local resource {file_name} -> {path}'

content=(root/'assets/menu-data.js').read_text(encoding='utf-8')
ids=re.findall(r"\bid:'([^']+)'",content)
assert len(ids) == len(set(ids)), 'Duplicate menu IDs'
assert len(ids) >= 90, f'Menu too short: {len(ids)}'
for token in ('price:350000','price:450000','price:550000'):
    assert token in content, f'Missing original lẩu riêu price {token}'
assert len(list((root/'assets/images').glob('menu-page-*.webp'))) == 15
assert (root/'thuc-don-rieu-viet.pdf').stat().st_size > 100_000
print(f'PASS: {len(expected_pages)} pages; {len(ids)} menu items; 15 menu images; all linked resources exist')
