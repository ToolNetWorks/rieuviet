from pathlib import Path
from io import BytesIO
import fitz
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent
OUT = ROOT/'assets'/'images'
OUT.mkdir(parents=True, exist_ok=True)
source_pdf = ROOT / 'Menu.pdf'
if not source_pdf.exists():
    source_pdf = Path('/mnt/data/Menu.pdf')
if not source_pdf.exists():
    raise SystemExit('Thiếu Menu.pdf. Đặt file vào thư mục dự án và chạy lại.')
doc = fitz.open(source_pdf)
# Crop coordinates use unrotated original PDF point space.
crops = {
    'lau-rieu-350.webp':(0,(0,325,176,534)),
    'lau-rieu-450.webp':(0,(161,328,353,538)),
    'lau-rieu-550.webp':(0,(339,325,514,538)),
    'lau-ga-nam.webp':(0,(26,604,256,854)),
    'lau-ga-nam-690.webp':(0,(263,604,514,854)),
    'lau-hai-san.webp':(1,(21,280,264,520)),
    'lau-hai-san-600.webp':(1,(257,280,510,520)),
    'lau-nam-chim-cau.webp':(1,(15,606,254,867)),
    'lau-nam-chim-cau-720.webp':(1,(253,606,512,867)),
    'lau-bo-tu-xuyen.webp':(2,(25,312,499,571)),
    'lau-ca-chep.webp':(3,(17,332,505,554)),
    'menu-snacks.webp':(4,(245,280,505,780)),
    'menu-ga.webp':(5,(15,315,314,550)),
    'menu-tom.webp':(7,(268,620,505,843)),
    'menu-de.webp':(12,(278,265,501,517)),
}
for fname,(n,coords) in crops.items():
    page=doc[n]
    pix=page.get_pixmap(matrix=fitz.Matrix(2,2),clip=fitz.Rect(coords),alpha=False)
    im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
    im.save(OUT/fname,'WEBP',quality=85,method=6)

# Full menu page previews, readable on mobile and downloadable as optimized PDF.
previews=[]
for i,page in enumerate(doc):
    pix=page.get_pixmap(matrix=fitz.Matrix(1.75,1.75),alpha=False)
    im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
    im.save(OUT/f'menu-page-{i+1:02d}.webp','WEBP',quality=83,method=6)
    # Build modest-size standalone PDF preserving original menu pages visually.
    buf=BytesIO()
    im.save(buf,format='JPEG',quality=84,optimize=True)
    previews.append((buf.getvalue(),page.rect))

optimized=fitz.open()
for jpeg,rect in previews:
    p=optimized.new_page(width=rect.width,height=rect.height)
    p.insert_image(rect,stream=jpeg)
optimized.set_metadata({'title':'Thực đơn RIEU VIỆT','subject':'Menu món lẩu và món ăn - bản xem trực tuyến','creator':'RIEU VIỆT'})
optimized.save(ROOT/'thuc-don-rieu-viet.pdf',garbage=4,deflate=True)
print('assets generated',len(crops),'images, 15 pages, pdf size',round((ROOT/'thuc-don-rieu-viet.pdf').stat().st_size/1048576,2),'MB')
