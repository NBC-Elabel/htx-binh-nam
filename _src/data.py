# -*- coding: utf-8 -*-
"""Nguồn dữ liệu duy nhất cho sản phẩm, bài viết và meta của từng trang.
Sửa nội dung ở đây (hoặc trong _src/pages, _src/partials) rồi chạy: python build.py
"""

ADDRESS = "Tổ 5, thôn Thái Đông, xã Thăng Trường, TP. Đà Nẵng"
PHONE_DISPLAY = "0971 292 430"
PHONE_TEL = "0971292430"
EMAIL = "htxdvnnbinhnam@gmail.com"
ZALO = "https://zalo.me/0971292430"

SEDIMENT = ("Dầu được ép từ hạt nguyên chất và không dùng hóa chất trong chế biến, nên đôi khi có lắng cặn tự nhiên ở đáy chai. "
            "Đây là đặc điểm của dầu ép và không ảnh hưởng đến chất lượng. Trước khi dùng, bạn chỉ cần để yên một lát cho cặn lắng xuống đáy, "
            "rồi rót nhẹ tay để giữ phần dầu trong.")
STORAGE = "Nơi khô ráo, thoáng mát, tránh nắng trực tiếp. Đậy kín nắp sau khi dùng."

PRODUCTS = [
    dict(
        id="dp500", slug="dau-dau-phong-500ml", line="dau-phong", img="dau-phong-500ml", fit="cover",
        name="Dầu đậu phộng Bình Nam 500 ml", pick="Dầu đậu phộng 500 ml", chip="500 ml", volume="500 ml", barcode="8938535139037",
        card="Gọn nhẹ, đủ cho bếp nhà.", fit_for="Gia đình nhỏ, bữa cơm hằng ngày",
        alt="Hai chai dầu đậu phộng Bình Nam 500 ml, mặt trước và mặt sau, đặt cạnh hạt đậu phộng",
        title="Dầu đậu phộng Bình Nam 500 ml | HTX Bình Nam",
        desc="Dầu đậu phộng Bình Nam 500 ml ép từ 100% hạt đậu phộng nguyên chất, dòng đạt OCOP 3 sao. Xem thông số, mã vạch và cách bảo quản.",
        intro="Chai 500 ml nhỏ gọn, dễ cầm và dễ cất trong tủ bếp. Dầu được ép từ 100% hạt đậu phộng nguyên chất, không dùng hóa chất trong chế biến, cho màu vàng óng và hương béo bùi tự nhiên. Đây là quy cách vừa đủ cho gia đình nhỏ, dùng để xào rau củ hằng ngày, trộn gỏi hoặc rưới lên món ăn trong bữa cơm thường ngày.",
        highlights=["Ép từ 100% hạt đậu phộng nguyên chất.", "Không dùng hóa chất trong chế biến.", "Chai 500 ml gọn nhẹ, dễ bảo quản trong tủ bếp.", "Dòng dầu đạt OCOP 3 sao, có phiếu kiểm nghiệm TSL 16 chỉ tiêu."],
        usage=["Xào rau củ: đun nóng 1–2 muỗng canh dầu trước khi cho rau vào.", "Trộn gỏi hoặc rưới lên rau luộc.", "Kho cá hoặc thịt cho đậm đà.", "Rót ra chén nhỏ, lấy lượng vừa đủ cho từng món."],
        recipes=["rau-cu-xao-dau-dau-phong"], cert=True),
    dict(
        id="dp1l", slug="dau-dau-phong-1l", line="dau-phong", img="dau-phong-1l", fit="cover",
        name="Dầu đậu phộng Bình Nam 1 lít", pick="Dầu đậu phộng 1 lít", chip="1 lít", volume="1 lít (1.000 ml)", barcode="8938535139006",
        card="Chai 1 lít, dùng lâu cho bếp gia đình.", fit_for="Gia đình đông người, bếp nấu thường ngày",
        alt="Hai chai dầu đậu phộng Bình Nam 1 lít, mặt trước và mặt sau, màu vàng óng",
        title="Dầu đậu phộng Bình Nam 1 lít | HTX Bình Nam",
        desc="Dầu đậu phộng Bình Nam 1 lít ép từ 100% hạt đậu phộng nguyên chất, không dùng hóa chất trong chế biến. Xem thông số, mã vạch và cách dùng.",
        intro="Chai 1 lít có dung tích lớn hơn, dùng đều tay cho bếp thường ngày. Dầu được ép từ 100% hạt đậu phộng nguyên chất, không dùng hóa chất trong chế biến, có màu vàng tươi và mùi thơm nhẹ. Dầu hợp với nhiều món như xào, kho hay rưới rau luộc. Mở nắp là dùng được ngay, rất tiện cho gia đình đông người.",
        highlights=["Ép từ 100% hạt đậu phộng nguyên chất.", "Không dùng hóa chất trong chế biến.", "Dung tích 1 lít, dùng đều tay cho bếp thường ngày.", "Dòng dầu đạt OCOP 3 sao, có phiếu kiểm nghiệm TSL 16 chỉ tiêu."],
        usage=["Xào rau củ hoặc xào thịt với một chút dầu, nêm vừa miệng.", "Kho cá hoặc thịt cho món đậm đà.", "Rưới lên rau luộc hoặc đậu hũ luộc ngay trước khi ăn.", "Dùng làm gia vị chung trong các món chế biến hằng ngày."],
        recipes=["rau-cu-xao-dau-dau-phong"], cert=True),
    dict(
        id="dp5l", slug="dau-dau-phong-5l", line="dau-phong", img="dau-phong-5l", fit="contain",
        name="Dầu đậu phộng Bình Nam can 5 lít", pick="Dầu đậu phộng can 5 lít", chip="Can 5 lít", volume="5 lít (5.000 ml)", barcode="Đang cập nhật",
        card="Đủ đầy cho bếp lớn.", fit_for="Bếp ăn, quán ăn, nhà hàng nhỏ",
        alt="Can dầu đậu phộng Bình Nam 5 lít có quai xách, nhãn xanh lá, bên cạnh hạt đậu phộng",
        title="Dầu đậu phộng Bình Nam can 5 lít | HTX Bình Nam",
        desc="Dầu đậu phộng Bình Nam can 5 lít có quai xách, dành cho bếp ăn và quán ăn. Ép từ 100% hạt đậu phộng nguyên chất.",
        intro="Can 5 lít có quai xách, dễ di chuyển trong bếp, dành cho bếp ăn và quán ăn cần lượng dầu lớn. Dầu được ép từ 100% hạt đậu phộng nguyên chất, không dùng hóa chất trong chế biến. Nhãn sản phẩm ghi rõ không chất bảo quản, không chất tạo màu và không chất tẩy trắng. Đủ đầy cho bếp lớn, dùng cho các món chế biến hằng ngày.",
        highlights=["Can 5 lít có quai xách, dễ di chuyển trong bếp.", "Ép từ 100% hạt đậu phộng nguyên chất, không dùng hóa chất trong chế biến.", "Nhãn ghi rõ: không chất bảo quản, không chất tạo màu, không chất tẩy trắng.", "Dòng dầu đạt OCOP 3 sao, có phiếu kiểm nghiệm TSL 16 chỉ tiêu."],
        usage=["Dùng cho các món xào, kho trong bếp ăn hằng ngày.", "Rót dầu ra chai nhỏ để dùng hằng ngày ngay tại bếp.", "Rưới dầu lên rau luộc hoặc món canh trước khi bưng ra.", "Giữ can đậy kín và đặt nơi khô ráo để dùng lâu."],
        recipes=["rau-cu-xao-dau-dau-phong"], cert=True),
    dict(
        id="me250", slug="dau-me-den-250ml", line="me-den", img="dau-me-den-250ml", fit="cover",
        name="Dầu mè đen Bình Nam 250 ml", pick="Dầu mè đen 250 ml", chip="250 ml", volume="250 ml", barcode="8938535139044",
        card="Một chai nhỏ, thơm cả bữa.", fit_for="Gia đình nhỏ, người mới dùng dầu mè đen",
        alt="Hai chai dầu mè đen Bình Nam 250 ml, có nhãn ghi dầu mè đen 250 ml",
        title="Dầu mè đen Bình Nam 250 ml | HTX Bình Nam",
        desc="Dầu mè đen Bình Nam 250 ml ép từ 100% hạt mè đen nguyên chất, không dùng hóa chất trong chế biến. Gợi ý dùng cho cơm, cháo và rau trộn.",
        intro="Chai 250 ml nhỏ gọn, vừa để làm quen với dầu mè đen, vừa tiện để sẵn trên bàn ăn. Dầu được ép từ 100% hạt mè đen nguyên chất, không dùng hóa chất trong chế biến, cho màu nâu hổ phách và hương mè thơm rõ. Chỉ cần vài giọt rưới lên cơm nóng, cháo hay rau trộn là món ăn đã đậm đà hơn.",
        highlights=["Ép từ 100% hạt mè đen nguyên chất.", "Không dùng hóa chất trong chế biến.", "Màu nâu hổ phách, hương mè thơm rõ.", "Chai 250 ml nhỏ gọn, dễ để sẵn trên bàn ăn."],
        usage=["Rưới vài giọt lên cơm nóng hoặc bát cháo.", "Chấm rau luộc hoặc rau sống cùng nước chấm.", "Cho một chút vào gỏi sau khi đã trộn đều.", "Thêm vài giọt vào canh cuối bữa để đổi vị."],
        recipes=["goi-tron-dau-me-den", "chao-ga-dau-me-den"], cert=False),
    dict(
        id="me500", slug="dau-me-den-500ml", line="me-den", img="dau-me-den-500ml", fit="cover",
        name="Dầu mè đen Bình Nam 500 ml", pick="Dầu mè đen 500 ml", chip="500 ml", volume="500 ml", barcode="8938535139051",
        card="Hương mè đậm, hợp cho cả gia đình.", fit_for="Gia đình, bếp ăn cần dầu mè đen thường xuyên",
        alt="Hai chai dầu mè đen Bình Nam 500 ml màu nâu hổ phách, cạnh hạt mè đen và bát dầu",
        title="Dầu mè đen Bình Nam 500 ml | HTX Bình Nam",
        desc="Dầu mè đen Bình Nam 500 ml ép từ 100% hạt mè đen nguyên chất, hương mè đậm. Xem thông số, mã vạch và cách bảo quản.",
        intro="Chai 500 ml là lựa chọn cân bằng giữa gọn nhẹ và đủ dùng cho gia đình. Dầu được ép từ 100% hạt mè đen nguyên chất, không dùng hóa chất trong chế biến, có màu hổ phách óng và mùi thơm đặc trưng. Hương mè đậm, hợp để trộn gỏi, rưới cháo, chấm rau hoặc thêm vào canh để đổi vị.",
        highlights=["Ép từ 100% hạt mè đen nguyên chất.", "Không dùng hóa chất trong chế biến.", "Màu hổ phách óng, mùi thơm đặc trưng.", "Chai 500 ml, cân bằng giữa gọn nhẹ và đủ dùng."],
        usage=["Rưới 1 muỗng cà phê lên cháo khi cháo còn nóng.", "Trộn gỏi, rưới lên rau củ trộn trước khi ăn.", "Chấm rau sống hoặc rau luộc.", "Thêm vài giọt vào canh để đổi vị."],
        recipes=["goi-tron-dau-me-den", "chao-ga-dau-me-den"], cert=False),
]
PRODUCT_BY_ID = {p["id"]: p for p in PRODUCTS}

# ---------------------------------------------------------------- bài viết
ARTICLES = [
    dict(
        slug="rau-cu-xao-dau-dau-phong", type="recipe", img="dau-phong-500ml", fit="cover",
        alt="Hai chai dầu đậu phộng Bình Nam 500 ml, mặt trước và mặt sau, đặt cạnh hạt đậu phộng",
        title="Rau củ xào dầu đậu phộng", time="khoảng 15 phút",
        sapo="Rau giòn xanh, vị béo nhẹ của dầu đậu phộng làm nền cho cả mâm cơm. Món xào nhanh, khoảng 15 phút là xong.",
        card="Rau giòn xanh, vị béo nhẹ của dầu đậu phộng làm nền cho cả mâm cơm.",
        meta_title="Rau củ xào dầu đậu phộng | HTX Bình Nam",
        meta_desc="Cách làm rau củ xào dầu đậu phộng trong khoảng 15 phút, với các bước đơn giản và mẹo nhỏ giúp rau giòn xanh.",
        ingredients=["Rau cải", "Cà rốt", "Tỏi", "Dầu đậu phộng, 1–2 muỗng canh", "Gia vị vừa miệng"],
        steps=["Rửa sạch rau cải, thái cà rốt lát mỏng, băm nhỏ tỏi.", "Đun nóng 1–2 muỗng canh dầu đậu phộng trong chảo.", "Phi tỏi cho thơm, cho cà rốt vào xào khoảng 2 phút.", "Thêm rau cải, đảo nhanh tay trên lửa lớn.", "Nêm gia vị vừa miệng, tắt bếp khi rau còn xanh giòn."],
        tip="Phi tỏi trên lửa vừa để tỏi thơm mà không bị khét. Rau cải chín nhanh, nên đảo nhanh tay và tắt bếp sớm để giữ màu xanh.",
        products=["dp500", "dp1l"]),
    dict(
        slug="goi-tron-dau-me-den", type="recipe", img="dau-me-den-500ml", fit="cover",
        alt="Hai chai dầu mè đen Bình Nam 500 ml màu nâu hổ phách, cạnh hạt mè đen và bát dầu",
        title="Gỏi trộn rưới dầu mè đen", time="khoảng 10 phút",
        sapo="Món trộn thanh mát, chỉ cần rưới một chút dầu mè đen là đậm đà hẳn lên.",
        card="Món trộn thanh mát, chỉ cần rưới một chút dầu mè đen là đậm đà hẳn lên.",
        meta_title="Gỏi trộn rưới dầu mè đen | HTX Bình Nam",
        meta_desc="Cách làm gỏi trộn thanh mát trong khoảng 10 phút, rưới dầu mè đen để tăng hương vị. Đủ nguyên liệu và các bước.",
        ingredients=["Bắp cải", "Cà rốt", "Hành tây", "Rau thơm", "Nước mắm, chanh, đường, tỏi ớt (pha nước trộn)", "Dầu mè đen, 1 muỗng cà phê", "Mè rang hoặc đậu phộng rang (tùy chọn)"],
        steps=["Thái sợi bắp cải và cà rốt, ngâm nước lạnh vài phút cho giòn.", "Thái mỏng hành tây, xé nhỏ rau thơm.", "Pha nước trộn với nước mắm, chanh, chút đường và tỏi ớt vừa miệng.", "Trộn đều rau củ với nước trộn, để ngấm khoảng 5 phút.", "Rưới 1 muỗng cà phê dầu mè đen lên trên, rắc thêm mè rang hoặc đậu phộng rang nếu thích."],
        tip="Ngâm bắp cải và cà rốt trong nước lạnh giúp rau giòn hơn khi trộn. Rưới dầu mè đen ngay trước khi ăn để hương mè giữ được rõ nét.",
        products=["me250", "me500"]),
    dict(
        slug="chao-ga-dau-me-den", type="recipe", img="dau-me-den-250ml", fit="cover",
        alt="Hai chai dầu mè đen Bình Nam 250 ml, có nhãn ghi dầu mè đen 250 ml",
        title="Cháo gà rưới dầu mè đen", time="khoảng 30 phút",
        sapo="Bát cháo nóng hổi, vài giọt dầu mè đen là thơm cả nhà.",
        card="Bát cháo nóng hổi, vài giọt dầu mè đen là thơm cả nhà.",
        meta_title="Cháo gà rưới dầu mè đen | HTX Bình Nam",
        meta_desc="Cách nấu cháo gà trong khoảng 30 phút, rưới dầu mè đen khi cháo còn nóng. Nguyên liệu, các bước và mẹo nhỏ dễ làm tại nhà.",
        ingredients=["Gạo", "Nước dùng", "Thịt gà đã luộc chín", "Hành lá", "Rau thơm", "Tiêu xay", "Dầu mè đen, 1 muỗng cà phê"],
        steps=["Nấu gạo với nước dùng đến khi cháo nhừ, nêm nhẹ tay.", "Xé thịt gà đã luộc chín, thái nhỏ hành lá.", "Múc cháo ra bát, cho thịt gà và hành lá lên trên.", "Rưới 1 muỗng cà phê dầu mè đen khi cháo còn nóng.", "Thêm chút tiêu xay và rau thơm, ăn ngay để giữ hương."],
        tip="Xé thịt gà khi còn hơi ấm để thịt tơi và dễ trộn đều với cháo. Dầu mè đen nên rưới sau cùng, khi cháo đã múc ra bát.",
        products=["me250", "me500"]),
    dict(
        slug="dat-ocop-3-sao", type="news", img="chung-nhan-ocop", fit="top", date="11/12/2024", iso="2024-12-11",
        alt="Giấy chứng nhận OCOP 3 sao cho dầu đậu phộng nguyên chất Bình Nam, UBND huyện Thăng Bình cấp ngày 11/12/2024",
        title="Dầu đậu phộng Bình Nam đạt OCOP 3 sao",
        sapo="Dầu đậu phộng nguyên chất Bình Nam được UBND huyện Thăng Bình công nhận đạt hạng 3 sao theo Chương trình OCOP.",
        card="Dầu đậu phộng nguyên chất Bình Nam được UBND huyện Thăng Bình công nhận đạt hạng 3 sao.",
        meta_title="Dầu đậu phộng Bình Nam đạt OCOP 3 sao | HTX Bình Nam",
        meta_desc="UBND huyện Thăng Bình công nhận dầu đậu phộng nguyên chất Bình Nam đạt OCOP 3 sao ngày 11/12/2024, theo QĐ số 3648/QĐ-UBND.",
        body=["Ngày 11/12/2024, UBND huyện Thăng Bình ban hành Quyết định số 3648/QĐ-UBND, công nhận sản phẩm dầu đậu phộng nguyên chất Bình Nam đạt OCOP 3 sao. Giấy chứng nhận có hiệu lực 36 tháng kể từ ngày được công nhận.",
              "Trên giấy chứng nhận ghi rõ tên sản phẩm, chủ thể sản xuất là HTX Dịch vụ Nông nghiệp Bình Nam và hạng 3 sao. Chứng nhận này áp dụng cho dầu đậu phộng. Dầu mè đen không thuộc phạm vi công nhận này.",
              "Chúng tôi trân trọng sự ghi nhận từ chính quyền địa phương và mong bạn có thêm một lý do để tin dùng dầu đậu phộng Bình Nam trong bữa cơm nhà. Giấy chứng nhận được công khai để bạn tự xem tại mục Giới thiệu và chứng nhận. Bên cạnh chứng nhận này, dầu đậu phộng còn có phiếu kiểm nghiệm TSL 16 chỉ tiêu, được giới thiệu trong bài {link:kiem-nghiem-16-chi-tieu|Dầu đậu phộng qua kiểm nghiệm 16 chỉ tiêu}."],
        cta=("Xem giấy chứng nhận", "gioi-thieu.html#chung-nhan"),
        products=["dp500", "dp1l", "dp5l"]),
    dict(
        slug="kiem-nghiem-16-chi-tieu", type="news", img="kiem-nghiem-tsl-1", fit="top", date="07/06/2024", iso="2024-06-07",
        alt="Trang 1 phiếu kết quả kiểm nghiệm của Trung tâm Kiểm nghiệm TSL, mẫu dầu lạc, bảng chỉ tiêu 1 đến 13",
        title="Dầu đậu phộng Bình Nam qua kiểm nghiệm 16 chỉ tiêu",
        sapo="Mẫu dầu đậu phộng đã được Trung tâm Kiểm nghiệm TSL thử nghiệm theo 16 chỉ tiêu, và kết quả được công khai để bạn tự xem.",
        card="Mẫu dầu đậu phộng đã được Trung tâm Kiểm nghiệm TSL thử nghiệm theo 16 chỉ tiêu.",
        meta_title="Dầu đậu phộng qua kiểm nghiệm 16 chỉ tiêu | HTX Bình Nam",
        meta_desc="Phiếu kiểm nghiệm TSL ngày 07/06/2024 cho mẫu dầu đậu phộng: béo tổng 99,9%, không phát hiện kim loại nặng và aflatoxin.",
        body=["Ngày 07/06/2024, Trung tâm Kiểm nghiệm TSL ban hành phiếu kết quả số 001032798.00 cho mẫu dầu đậu phộng. Phép thử thực hiện theo tiêu chuẩn ISO/IEC 17025:2017.",
              "Kết quả chính: béo tổng đạt 99,9%, năng lượng 899 kcal/100 g. Carbohydrate, đạm tổng và tạp chất không tan cũng không phát hiện. Các chỉ tiêu được thử không phát hiện gồm kim loại nặng (Asen, Cadimi, Thủy ngân, Chì), aflatoxin, ochratoxin A và 4 hoạt chất thuốc bảo vệ thực vật (Aldicarb, Methoxyfenozide, Penthiopyrad, Propargite).",
              "Kết quả chỉ áp dụng cho mẫu thử nêu trong phiếu. Phiếu gốc có đầy đủ phương pháp thử, bạn có thể xem ảnh phiếu tại mục Giới thiệu và chứng nhận.",
              "HTX công bố phiếu này để bạn tự đối chiếu, thay vì chỉ nói bằng lời. Nếu bạn có câu hỏi về từng chỉ tiêu, cứ gọi {phone} hoặc gửi email về {email} để được hỗ trợ."],
        cta=("Xem phiếu kiểm nghiệm", "gioi-thieu.html#chung-nhan"),
        products=["dp500", "dp1l", "dp5l"]),
]
ARTICLE_BY_SLUG = {a["slug"]: a for a in ARTICLES}
HOME_ARTICLES = ["dat-ocop-3-sao", "kiem-nghiem-16-chi-tieu", "rau-cu-xao-dau-dau-phong"]

# ---------------------------------------------------------------- meta các trang tĩnh
META = {
    "index.html": ("Dầu đậu phộng và dầu mè đen Bình Nam | HTX Bình Nam", "HTX Dịch vụ Nông nghiệp Bình Nam ép dầu đậu phộng và dầu mè đen từ 100% hạt nguyên chất. OCOP 3 sao, kiểm nghiệm 16 chỉ tiêu."),
    "gioi-thieu.html": ("Giới thiệu và chứng nhận | HTX Bình Nam", "Câu chuyện HTX Bình Nam, quy trình ép dầu từ hạt, giấy chứng nhận OCOP 3 sao và phiếu kiểm nghiệm TSL 16 chỉ tiêu."),
    "san-pham.html": ("Sản phẩm dầu đậu phộng và dầu mè đen | HTX Bình Nam", "Dầu đậu phộng và dầu mè đen Bình Nam từ chai 250 ml đến can 5 lít. So sánh hai dòng dầu, xem thông số và câu hỏi thường gặp."),
    "goc-bep.html": ("Góc bếp: công thức và tin tức | HTX Bình Nam", "Công thức xào, gỏi, cháo dùng dầu đậu phộng và dầu mè đen, cùng tin về OCOP 3 sao và kiểm nghiệm 16 chỉ tiêu của HTX."),
    "lien-he.html": ("Liên hệ và đặt hàng | HTX Bình Nam", "Chọn sản phẩm và số lượng, để lại số điện thoại. HTX sẽ gọi lại để xác nhận đơn, hoặc gọi trực tiếp 0971 292 430."),
    "404.html": ("Không tìm thấy trang | HTX Bình Nam", "Trang bạn tìm không còn ở đây. Quay về trang chủ hoặc xem các sản phẩm của HTX Bình Nam."),
}
