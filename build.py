# -*- coding: utf-8 -*-
"""Build website tĩnh nhiều trang cho HTX Bình Nam (chỉ dùng thư viện chuẩn).

Chạy:  python build.py
Nguồn: _src/ (partials, pages, data.py). Kết quả ghi ra thư mục gốc và san-pham/, goc-bep/.
Mọi đường dẫn là tương đối theo độ sâu trang, nên chạy được ở user.github.io/<repo>/, tên miền riêng và file://.
"""
import html
import json
import os
import re
import shutil
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "_src")
sys.path.insert(0, SRC)
import data as D  # noqa: E402

# Điền địa chỉ gốc của website (không có dấu "/" ở cuối) để sinh canonical, og:url và sitemap.xml.
# Ví dụ: "https://htxbinhnam.github.io/website" hoặc "https://www.ten-mien.vn". Để trống nếu chưa có.
SITE_URL = "https://nbc-elabel.github.io/htx-binh-nam"

IMG = {  # (rộng gốc, cao gốc, rộng bản webp lớn)  — bản 800 luôn rộng 800
    "dau-phong-500ml": (1280, 1170, 1280), "dau-phong-1l": (1280, 1170, 1280), "dau-phong-5l": (853, 1280, 853),
    "dau-me-den-250ml": (1280, 853, 1280), "dau-me-den-500ml": (1280, 1170, 1280),
    "chung-nhan-ocop": (950, 1336, 950), "kiem-nghiem-tsl-1": (930, 1280, 930), "kiem-nghiem-tsl-2": (920, 1280, 920),
}
LINE_LABEL = {"dau-phong": "Đậu phộng", "me-den": "Mè đen"}
E = lambda s: html.escape(s, quote=True)


# ------------------------------------------------------------------ template engine
def read(path):
    with open(os.path.join(SRC, path), encoding="utf-8") as f:
        return f.read()


def pic(base, alt, loading, sizes, cls, root):
    w, h, w2 = IMG[base]
    ex = ' fetchpriority="high"' if loading == "eager" else ""
    c = ' class="%s"' % cls if cls else ""
    return ('<picture><source type="image/webp" srcset="%sassets/img/%s-800.webp 800w, %sassets/img/%s-1600.webp %dw" sizes="%s">'
            '<img%s src="%sassets/img/%s.jpg" width="%d" height="%d" alt="%s" loading="%s" decoding="async"%s></picture>'
            % (root, base, root, base, w2, sizes, c, root, base, w, h, E(alt), loading, ex))


def render(text, ctx):
    for _ in range(6):
        new = re.sub(r"\{\{> ([\w-]+)\}\}", lambda m: read("partials/%s.html" % m.group(1)).rstrip("\n"), text)
        if new == text:
            break
        text = new
    for k, v in ctx.items():
        text = text.replace("{{%s}}" % k, v)
    text = re.sub(r"@@PIC\((.*?)\)@@", lambda m: pic(*m.group(1).split("|"), root=ctx["root"]), text)
    left = re.findall(r"\{\{[^}]+\}\}", text)
    if left:
        raise SystemExit("Chưa thay hết placeholder: %s (trang %s)" % (sorted(set(left)), ctx.get("_page")))
    return text


# ------------------------------------------------------------------ cards & fragments
SIZES_CARD = "(min-width: 960px) 380px, (min-width: 640px) 45vw, 92vw"


def product_href(p, root):
    return "%ssan-pham/%s.html" % (root, p["slug"])


def article_href(a, root):
    return "%sgoc-bep/%s.html" % (root, a["slug"])


def product_card(p, root, filterable=False):
    flt = ' data-filterable=""' if filterable else ""
    return (
        '      <article class="product-card reveal" data-line="%s"%s%s>\n'
        '        <div class="pc-media"><span class="pc-tag">%s</span>@@PIC(%s|%s|lazy|%s|)@@</div>\n'
        '        <div class="pc-body"><h3><a class="pc-link" href="%s">%s</a></h3><p class="pc-tagline">%s</p><p class="pc-for">Phù hợp: %s</p>\n'
        '        <div class="pc-actions"><span class="pc-more">Xem chi tiết <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></span>'
        '<a class="pc-order" href="%slien-he.html?sp=%s" aria-label="Đặt %s">Đặt hàng</a></div></div>\n'
        '      </article>'
        % (p["line"], ' data-fit="contain"' if p["fit"] == "contain" else "", flt, LINE_LABEL[p["line"]], p["img"], p["alt"], SIZES_CARD,
           product_href(p, root), E(p["name"]), E(p["card"]), E(p["fit_for"][0].lower() + p["fit_for"][1:]), root, p["id"], E(p["name"][0].lower() + p["name"][1:])))


def cta_tile(root, filterable=False):
    flt = ' data-filterable=""' if filterable else ""
    parts = [
        '      <aside class="product-card pc-cta reveal" data-line="cta"%s aria-label="Tư vấn quy cách">' % flt,
        '        <svg class="icon icon-big" aria-hidden="true"><use href="#i-chat"/></svg>',
        '        <h3>Chưa chắc chọn quy cách nào?</h3>',
        '        <p>Để lại vài dòng, HTX sẽ liên hệ tư vấn quy cách phù hợp với bếp nhà bạn.</p>',
        '        <a class="btn btn--gold" href="%slien-he.html">Tư vấn thêm <svg class="icon icon-go" aria-hidden="true"><use href="#i-arrow"/></svg></a>' % root,
        '      </aside>',
    ]
    return chr(10).join(parts)


def post_card(a, root, filterable=False):
    flt = ' data-filterable=""' if filterable else ""
    kind = "cong-thuc" if a["type"] == "recipe" else "tin-tuc"
    label = "Công thức" if a["type"] == "recipe" else "Tin tức"
    meta = a["time"] if a["type"] == "recipe" else a["date"]
    time_el = ('<time datetime="%s">%s</time>' % (a["iso"], meta)) if a["type"] == "news" else "<span>%s</span>" % meta
    return (
        '      <article class="post-card reveal" data-line="%s"%s>\n'
        '        <div class="po-media po-media--%s">@@PIC(%s|%s|lazy|%s|)@@</div>\n'
        '        <div class="po-body"><div class="po-meta"><span class="po-type po-type--%s">%s</span>%s</div>\n'
        '        <h3><a class="po-link" href="%s">%s</a></h3><p>%s</p>'
        '<span class="pc-more">Đọc tiếp <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></span></div>\n'
        '      </article>'
        % (kind, flt, a["fit"], a["img"], a["alt"], SIZES_CARD, kind, label, time_el, article_href(a, root), E(a["title"]), E(a["card"])))


def breadcrumb(items, root, page_path):
    """items: [(nhãn, đường dẫn tương đối từ gốc site hoặc None cho trang hiện tại)]. Trả (html, jsonld)."""
    lis, elems = [], []
    for i, (label, path) in enumerate(items, 1):
        if path is None:
            lis.append('<li aria-current="page">%s</li>' % E(label))
            url = page_path
        else:
            lis.append('<li><a href="%s%s">%s</a></li>' % (root, path, E(label)))
            url = path
        elems.append({"@type": "ListItem", "position": i, "name": label, "item": absurl(url, root)})
    nav = '<nav class="breadcrumb" aria-label="Đường dẫn"><ol>%s</ol></nav>' % "".join(lis)
    return nav, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": elems}


def absurl(path, root):
    return (SITE_URL + "/" + path) if SITE_URL else (root + path)


def jsonld(*objs):
    return "\n".join('<script type="application/ld+json">\n%s\n</script>' % json.dumps(o, ensure_ascii=False, indent=2).replace("</", "<\\/") for o in objs)


def linkify(text, root):
    text = text.replace("{phone}", '<a href="tel:%s">%s</a>' % (D.PHONE_TEL, D.PHONE_DISPLAY))
    text = text.replace("{email}", '<a href="mailto:%s">%s</a>' % (D.EMAIL, D.EMAIL))
    return re.sub(r"\{link:([\w-]+)\|([^}]+)\}", lambda m: '<a class="inline-link" href="%s.html">%s</a>' % (m.group(1), m.group(2)), text)


# ------------------------------------------------------------------ page definitions
def base_ctx(path, title, desc, cur, body_class="", og_type="website", extra_ld=(), preload="", footer_wave="#FBF7EE", og_image=None):
    depth = path.count("/")
    root = "../" * depth
    canonical = ""
    if SITE_URL:
        u = SITE_URL + "/" + path
        canonical = '<link rel="canonical" href="%s">\n<meta property="og:url" content="%s">' % (u, u)
    ctx = {
        "_page": path, "root": root, "title": E(title), "description": E(desc), "canonical": canonical, "og_type": og_type,
        "og_image": absurl("assets/img/dau-phong-500ml-1600.webp", root), "preload": preload, "jsonld": jsonld(*extra_ld) if extra_ld else "",
        "body_class": body_class, "footer_wave": footer_wave,
        "address": D.ADDRESS, "phone": D.PHONE_DISPLAY, "phone_tel": D.PHONE_TEL, "email": D.EMAIL, "zalo": D.ZALO,
        "footer_products": "\n".join('          <li><a href="%s">%s</a></li>' % (product_href(p, root), E(p["pick"])) for p in D.PRODUCTS),
        "extra_end": "", "breadcrumb": "", "eyebrow": "", "h1": "", "lead": "",
        # màu sóng mặc định giữa các khối (sóng lấy màu của khối phía trên)
        "wave_compare": "#F5EEDD", "wave_faq": "#FBF7EE", "wave_process": "#FBF7EE", "wave_story": "#F5EEDD", "wave_quality": "#EEF3E6",
    }
    for k in ("home", "gioithieu", "sanpham", "gocbep", "lienhe"):
        ctx["cur_" + k] = ' aria-current="page"' if k == cur else ""
    return ctx


LAYOUT = ("{{> head}}\n{{> sprite}}\n{{> header}}\n\n<main id=\"noi-dung-chinh\">\n%s\n</main>\n\n{{> footer}}\n{{> fabs}}\n%s\n{{> scripts}}\n")


def build_pages():
    pages = {}  # đường dẫn -> html
    nav_ld = []

    def simple(path, tpl, cur, eyebrow, h1, lead, crumbs, body_class="", footer_wave="#FBF7EE", lightbox=False, waves=None, ctx_extra=None):
        title, desc = D.META[path]
        root = "../" * path.count("/")
        bc, bld = breadcrumb(crumbs, root, path)
        ctx = base_ctx(path, title, desc, cur, body_class, extra_ld=[bld], footer_wave=footer_wave)
        ctx.update(breadcrumb=bc, eyebrow=eyebrow, h1=h1, lead=lead)
        ctx.update(waves or {})
        ctx.update(ctx_extra or {})
        body = read("pages/%s" % tpl).rstrip("\n")
        pages[path] = render(LAYOUT % (body, "{{> lightbox}}" if lightbox else ""), ctx)

    # ---- trang chủ
    title, desc = D.META["index.html"]
    org = {"@context": "https://schema.org", "@type": "Organization", "name": "HTX Dịch vụ Nông nghiệp Bình Nam",
           "logo": absurl("assets/img/logo-badge-320.png", ""), "telephone": "+84971292430", "email": D.EMAIL,
           "address": {"@type": "PostalAddress", "streetAddress": "Tổ 5, thôn Thái Đông", "addressLocality": "xã Thăng Trường, TP. Đà Nẵng", "addressCountry": "VN"},
           "description": "Hợp tác xã ép dầu đậu phộng và dầu mè đen từ 100% hạt nguyên chất."}
    preload = ('<link rel="preload" as="image" type="image/webp" href="assets/img/dau-phong-500ml-800.webp" '
               'imagesrcset="assets/img/dau-phong-500ml-800.webp 800w, assets/img/dau-phong-500ml-1600.webp 1280w" '
               'imagesizes="(min-width: 960px) 520px, 420px" fetchpriority="high">')
    ctx = base_ctx("index.html", title, desc, "home", "page-home", extra_ld=[org], preload=preload, footer_wave="#1F6B3A")
    ctx["product_cards"] = "\n".join([product_card(p, "") for p in D.PRODUCTS] + [cta_tile("")])
    ctx["home_posts"] = "\n".join(post_card(D.ARTICLE_BY_SLUG[s], "") for s in D.HOME_ARTICLES)
    pages["index.html"] = render(LAYOUT % (read("pages/index.html").rstrip("\n"), ""), ctx)

    # ---- giới thiệu
    simple("gioi-thieu.html", "gioi-thieu.html", "gioithieu", "Giới thiệu", "Giữ trọn cái gốc của hạt quê",
           "Câu chuyện của HTX, quy trình làm dầu từ hạt, cùng giấy chứng nhận và phiếu kiểm nghiệm để bạn tự xem.",
           [("Trang chủ", "index.html"), ("Giới thiệu", None)], "page-about", footer_wave="#FFFFFF", lightbox=True)

    # ---- sản phẩm
    simple("san-pham.html", "san-pham.html", "sanpham", "Sản phẩm", "Sản phẩm của Bình Nam",
           "Hai dòng dầu, năm quy cách. Chọn chai vừa đủ cho bếp nhà bạn, rồi xem bảng so sánh và các câu hỏi thường gặp bên dưới.",
           [("Trang chủ", "index.html"), ("Sản phẩm", None)], "page-products", footer_wave="#FFFFFF",
           ctx_extra={"product_cards": "\n".join([product_card(p, "", True) for p in D.PRODUCTS] + [cta_tile("", True)])})

    # ---- góc bếp
    posts_sorted = sorted(D.ARTICLES, key=lambda a: (a["type"] != "recipe", a["slug"]))  # công thức trước, ổn định
    order = ["rau-cu-xao-dau-dau-phong", "goi-tron-dau-me-den", "chao-ga-dau-me-den", "dat-ocop-3-sao", "kiem-nghiem-16-chi-tieu"]
    posts_sorted = [D.ARTICLE_BY_SLUG[s] for s in order]
    simple("goc-bep.html", "goc-bep.html", "gocbep", "Góc bếp", "Góc bếp Bình Nam",
           "Công thức nhanh cho bữa cơm nhà và tin tức về HTX. Chọn mục Công thức hoặc Tin tức để lọc bài.",
           [("Trang chủ", "index.html"), ("Góc bếp", None)], "page-posts",
           ctx_extra={"posts_grid": "\n".join(post_card(a, "", True) for a in posts_sorted)})

    # ---- liên hệ
    simple("lien-he.html", "lien-he.html", "lienhe", "Liên hệ", "Đặt hàng hoặc hỏi thêm",
           "Chọn sản phẩm và số lượng, để lại số điện thoại. HTX sẽ gọi lại để xác nhận đơn.",
           [("Trang chủ", "index.html"), ("Liên hệ", None)], "page-contact", footer_wave="#F5EEDD")

    # ---- 5 trang chi tiết sản phẩm
    for p in D.PRODUCTS:
        path = "san-pham/%s.html" % p["slug"]
        root = "../"
        bc, bld = breadcrumb([("Trang chủ", "index.html"), ("Sản phẩm", "san-pham.html"), (p["name"], None)], root, path)
        prod_ld = {"@context": "https://schema.org", "@type": "Product", "name": p["name"], "description": p["desc"],
                   "image": absurl("assets/img/%s.jpg" % p["img"], root), "brand": {"@type": "Brand", "name": "Bình Nam"},
                   "category": "Dầu ăn"}
        if p["barcode"].isdigit():
            prod_ld["gtin13"] = p["barcode"]
        ctx = base_ctx(path, p["title"], p["desc"], "sanpham", "page-product", og_type="product", extra_ld=[prod_ld, bld], footer_wave="#FBF7EE")
        ctx["og_image"] = absurl("assets/img/%s-1600.webp" % p["img"], root)
        w, h, _ = IMG[p["img"]]
        spec = [("Thành phần", "100%% %s nguyên chất" % ("đậu phộng" if p["line"] == "dau-phong" else "mè đen")), ("Thể tích", p["volume"]),
                ("Mã vạch", p["barcode"]), ("Xuất xứ", "Việt Nam"), ("Nơi sản xuất", D.ADDRESS), ("Bảo quản", D.STORAGE)]
        cert = ""
        if p["cert"]:
            cert = ('    <div class="pd-card pd-card--cert reveal">\n      <h2 class="h3">Chứng nhận và kiểm nghiệm</h2>\n      <ul class="check-list">\n'
                    '        <li>Dầu đậu phộng nguyên chất Bình Nam đạt OCOP 3 sao, UBND huyện Thăng Bình công nhận ngày 11/12/2024 theo QĐ số 3648/QĐ-UBND, hiệu lực 36 tháng.</li>\n'
                    '        <li>Phiếu kiểm nghiệm TSL số 001032798.00, ngày 07/06/2024, 16 chỉ tiêu theo ISO/IEC 17025:2017. Kết quả chỉ áp dụng cho mẫu thử nêu trong phiếu.</li>\n'
                    '      </ul>\n      <a class="btn btn--sm" href="../gioi-thieu.html#chung-nhan">Xem giấy chứng nhận và phiếu kiểm nghiệm</a>\n    </div>')
        others = [q for q in D.PRODUCTS if q["id"] != p["id"]]
        others.sort(key=lambda q: (q["line"] != p["line"]))  # cùng dòng trước
        ctx.update(
            breadcrumb=bc, line=p["line"], img=p["img"], img_w=str(w), img_h=str(h), name=E(p["name"]), alt=E(p["alt"]), chip=p["chip"], id=p["id"],
            pic="@@PIC(%s|%s|eager|(min-width: 960px) 560px, 92vw|)@@" % (p["img"], p["alt"]),
            ocop_tag='<span class="chip chip--ocop">OCOP 3 sao</span>' if p["cert"] else "",
            intro=E(p["intro"]), highlights="\n".join("        <li>%s</li>" % E(x) for x in p["highlights"]),
            usage="\n".join("        <li>%s</li>" % E(x) for x in p["usage"]), fit_for=E(p["fit_for"]),
            spec_rows="\n".join("          <tr><th scope=\"row\">%s</th><td>%s</td></tr>" % (k, E(v)) for k, v in spec),
            sediment=E(D.SEDIMENT), cert_block=cert,
            related_products="\n".join(product_card(q, root) for q in others[:3]),
            related_posts="\n".join(post_card(D.ARTICLE_BY_SLUG[s], root) for s in p["recipes"]),
        )
        ctx["data_src_root"] = ""
        body = read("pages/product.html").rstrip("\n").replace('data-src="assets/img/', 'data-src="assets/img/')
        pages[path] = render(LAYOUT % (body, "{{> lightbox}}"), ctx)

    # ---- 5 bài viết
    for a in D.ARTICLES:
        path = "goc-bep/%s.html" % a["slug"]
        root = "../"
        label = "Công thức" if a["type"] == "recipe" else "Tin tức"
        bc, bld = breadcrumb([("Trang chủ", "index.html"), ("Góc bếp", "goc-bep.html"), (a["title"], None)], root, path)
        art_ld = {"@context": "https://schema.org", "@type": "Recipe" if a["type"] == "recipe" else "NewsArticle", "headline" if a["type"] == "news" else "name": a["title"],
                  "description": a["meta_desc"], "image": absurl("assets/img/%s.jpg" % a["img"], root),
                  "author": {"@type": "Organization", "name": "HTX Dịch vụ Nông nghiệp Bình Nam"}}
        if a["type"] == "news":
            art_ld["datePublished"] = a["iso"]
            art_ld["publisher"] = {"@type": "Organization", "name": "HTX Dịch vụ Nông nghiệp Bình Nam"}
        else:
            art_ld["recipeIngredient"] = a["ingredients"]
            art_ld["recipeInstructions"] = [{"@type": "HowToStep", "text": s} for s in a["steps"]]
        ctx = base_ctx(path, a["meta_title"], a["meta_desc"], "gocbep", "page-article", og_type="article", extra_ld=[art_ld, bld], footer_wave="#FBF7EE")
        ctx["og_image"] = absurl("assets/img/%s-1600.webp" % a["img"], root)
        if a["type"] == "recipe":
            body = ('      <h2 class="h3">Nguyên liệu</h2>\n      <ul class="check-list">\n%s\n      </ul>\n      <h2 class="h3">Các bước</h2>\n      <ol class="steps steps--big">\n%s\n      </ol>\n'
                    '      <aside class="tip"><b>Mẹo nhỏ:</b> %s</aside>\n'
                    % ("\n".join("        <li>%s</li>" % E(x) for x in a["ingredients"]), "\n".join("        <li>%s</li>" % E(x) for x in a["steps"]), E(a["tip"])))
            meta_line = a["time"]
            rel_title = "Sản phẩm dùng kèm"
        else:
            body = "\n".join("      <p>%s</p>" % linkify(E(t).replace("&#x27;", "'"), root) for t in a["body"])
            body += '\n      <p><a class="btn" href="../%s">%s</a></p>' % (a["cta"][1], a["cta"][0])
            meta_line = "Ngày đăng %s" % a["date"]
            rel_title = "Sản phẩm liên quan"
        prods = [D.PRODUCT_BY_ID[i] for i in a["products"]]
        others = [x for x in D.ARTICLES if x["slug"] != a["slug"]]
        others.sort(key=lambda x: (x["type"] != a["type"], D.ARTICLES.index(x)))
        ctx.update(breadcrumb=bc, type_label=label, meta_line=meta_line, title=E(a["title"]), sapo=E(a["sapo"]), article_body=body,
                   pic="@@PIC(%s|%s|lazy|(min-width: 960px) 420px, 92vw|)@@" % (a["img"], a["alt"]), rel_products_title=rel_title,
                   related_products="\n".join(product_card(q, root) for q in prods),
                   related_posts="\n".join(post_card(x, root) for x in others[:2]))
        ctx["title"] = E(a["meta_title"])  # <title> khác H1; H1 dùng {{title}} trong template nên tách khóa
        ctx["title"] = E(a["meta_title"])
        pages[path] = render(LAYOUT % (read("pages/article.html").rstrip("\n").replace('<h1 class="page-title">{{title}}</h1>', '<h1 class="page-title">{{h1}}</h1>'), ""), dict(ctx, h1=E(a["title"])))

    pages["404.html"] = build_404()
    return pages


def build_404():
    title, desc = D.META["404.html"]
    ctx = base_ctx("404.html", title, desc, "", "page-404", footer_wave="#FBF7EE")
    body = ('<section class="notfound"><div class="container"><span class="eyebrow">404</span><h1 class="page-title">Ối, trang này đi lạc rồi</h1>'
            '<p class="lead">Trang bạn tìm không còn ở đây, bạn thử quay về trang chủ hoặc xem các sản phẩm của HTX nhé.</p>'
            '<div class="pd-actions"><a class="btn" href="{{root}}index.html">Về trang chủ</a><a class="btn btn--ghost-dark" href="{{root}}san-pham.html">Xem sản phẩm</a></div></div></section>')
    text = render(LAYOUT % (body, ""), ctx)
    # 404.html được GitHub Pages phục vụ ở MỌI độ sâu URL, nên đường dẫn tương đối sẽ sai.
    # Cách xử lý: nhúng CSS trực tiếp, chuyển mọi href/src/srcset tương đối thành data-b-*, rồi script nhỏ tính thư mục gốc site
    # (SITE_URL nếu có; nếu không thì suy ra từ *.github.io/<repo>/ hoặc "/") và gán lại trước khi tải main.js.
    css = open(os.path.join(BASE, "assets/css/style.css"), encoding="utf-8").read()
    text = text.replace('<link rel="stylesheet" href="assets/css/style.css">', "<style>\n%s\n</style>" % css)
    text = re.sub(r'<link rel="(?:icon|apple-touch-icon)"[^>]*>\n', "", text)
    text = re.sub(r'<script type="speculationrules">.*?</script>\n', "", text, flags=re.S)
    text = text.replace('<script src="assets/js/main.js"></script>', "")
    text = re.sub(r'\b(href|src|srcset)="(?!https?:|#|tel:|mailto:|data:)([^"]*)"', lambda m: 'data-b-%s="%s"' % (m.group(1), m.group(2)), text)
    fixer = ('<script>(function(){var site=%s,h=location.hostname,seg=location.pathname.split("/").filter(Boolean),base="/";'
             'if(site){base=site.replace(/\\/$/,"")+"/";}else if(/\\.github\\.io$/.test(h)&&seg.length&&seg[0].indexOf(".")<0){base="/"+seg[0]+"/";}'
             'function fix(a){return a.split(",").map(function(p){return base+p.trim();}).join(", ");}'
             '["href","src","srcset"].forEach(function(n){document.querySelectorAll("[data-b-"+n+"]").forEach(function(el){var v=el.getAttribute("data-b-"+n);'
             'el.setAttribute(n,n==="srcset"?fix(v):base+v);el.removeAttribute("data-b-"+n);});});'
             'var i=document.createElement("link");i.rel="icon";i.href=base+"assets/img/favicon-64.png";document.head.appendChild(i);'
             'document.write("<script src=\\""+base+"assets/js/main.js\\"><\\/script>");})();</script>' % json.dumps(SITE_URL))
    text = text.replace("</body>", fixer + "\n</body>")
    return text


# ------------------------------------------------------------------ output
def write(path, content):
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full) or BASE, exist_ok=True)
    with open(full, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)


def main():
    legacy = os.path.join(SRC, "legacy-onepage.html")
    idx = os.path.join(BASE, "index.html")
    if not os.path.exists(legacy) and os.path.exists(idx):
        shutil.copyfile(idx, legacy)  # sao lưu bản một trang cũ trước khi bị ghi đè lần đầu
    pages = build_pages()
    for path, content in sorted(pages.items()):
        write(path, content)
    write(".nojekyll", "")
    robots = "User-agent: *\nAllow: /\n"
    if SITE_URL:
        robots += "Sitemap: %s/sitemap.xml\n" % SITE_URL
        urls = "".join("  <url><loc>%s/%s</loc></url>\n" % (SITE_URL, p) for p in sorted(pages) if p != "404.html")
        write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n%s</urlset>\n' % urls)
    elif os.path.exists(os.path.join(BASE, "sitemap.xml")):
        os.remove(os.path.join(BASE, "sitemap.xml"))
    write("robots.txt", robots)
    print("Đã build %d trang%s:" % (len(pages), " (SITE_URL=%s)" % SITE_URL if SITE_URL else " (chưa đặt SITE_URL: bỏ canonical/sitemap)"))
    for p in sorted(pages):
        print("  %-48s %6d byte" % (p, len(pages[p].encode("utf-8"))))


if __name__ == "__main__":
    main()
