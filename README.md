# Thiệp cưới online — Duy Lâm & Yến Nhi

Thiệp cưới một trang, chạy tĩnh (HTML + CSS + JavaScript thuần), không cần build,
không phụ thuộc thư viện ngoài. Mở `index.html` là chạy được.

- **Thiết kế:** dựng theo mẫu *Minimalism Đỏ Đậm* của chungdoi.com — nền đỏ đô,
  tờ giấy kem có khung vàng, chữ đỏ đô, nhấn vàng.
- **Nền:** `images/main_bg.jpg`.
- **Nội dung:** lấy từ hai file `Thiệp cưới SG v1.1.pdf` và `thiệp cưới HN 1012 v1.1.2.pdf`.
- **Hai ngày cưới ở hai nơi** — cách trình bày theo mẫu *Thiệp cưới 47* của
  cinelove.me: mỗi buổi tiệc một thẻ riêng có nút chỉ đường, và lịch tháng
  khoanh tim cả hai ngày.

| | TP. Hồ Chí Minh — nhà gái | Hà Nội — nhà trai |
|---|---|---|
| Ngày | Thứ Bảy 28 / 11 / 2026 (20 / 10 Bính Ngọ) | Thứ Năm 10 / 12 / 2026 (02 / 11 Bính Ngọ) |
| Tiệc | Asiana Plaza — đón khách 18:00, khai tiệc 19:00 | Nhà văn hoá thôn Mai Hiên — 12:00 |

---

## Chạy thử

Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một máy chủ tĩnh:

```bash
python -m http.server 8000
# rồi mở http://127.0.0.1:8000
```

---

## Các mục trong thiệp

| # | Mục | Nội dung |
|---|---|---|
| — | Bìa | Tên, hai ngày cưới, nút "Mở thiệp" |
| 1 | Save the date | Hình minh hoạ, tên, hai ngày ở hai thành phố |
| 2 | Thông tin lễ cưới | Hai họ, quê quán, cô dâu chú rể |
| 3 | Thư mời tiệc cưới | Hai thẻ tiệc, mỗi thẻ có nút **Chỉ đường** và **Thêm vào lịch** |
| 4 | Lịch cưới | Lịch tháng 11 và 12 khoanh tim ngày cưới + đếm ngược tới buổi tiệc gần nhất |
| 5 | Lịch trình tiệc | Năm mốc giờ của tiệc TP.HCM, theo trang 4 của PDF TP.HCM |
| 6 | Album | **Tự ẩn** khi chưa có ảnh |
| 7 | Xác nhận tham dự | Khách chọn dự tiệc TP.HCM, Hà Nội hay cả hai |
| 8 | Hộp quà mừng | **Tự ẩn** khi chưa điền số tài khoản |
| 9 | Cảm ơn | Lời kết |

---

## Còn phải điền / xác nhận

### Tên mẹ cô dâu — hai PDF ghi khác nhau

Bản TP.HCM ghi **Huỳnh Thị Xanh**, bản Hà Nội ghi **Huỳnh Thị Thanh**. Thiệp đang
dùng "Xanh" — sửa trong `index.html`, mục số 2 (có ghi chú ngay cạnh dòng đó).

### Số tài khoản mừng cưới — chưa có trong PDF

Sửa `CONFIG.banks` trong `assets/js/main.js`. Khi `number` còn trống thì cả mục
"Hộp quà mừng" tự ẩn, khách không thấy số giả:

```js
banks: [
  { side: 'Chú rể', bank: 'Vietcombank', owner: 'PHAM DUY LAM',     number: '0123456789', qr: 'images/qr-chu-re.png' },
  { side: 'Cô dâu', bank: 'Techcombank', owner: 'LE HUYNH YEN NHI', number: '9876543210', qr: '' }
]
```

### Ảnh cưới

Bỏ ảnh vào `images/album/` rồi liệt kê vào `CONFIG.album`:

```js
album: ['images/album/01.jpg', 'images/album/02.jpg']
```

Nên dùng ảnh dọc (tỉ lệ 3:4), nén xuống dưới 500 KB mỗi ảnh.

---

## Sửa nội dung

Toàn bộ chữ nằm trong `index.html`, mỗi mục có một khối chú thích lớn đánh số
trùng với bảng ở trên. Sửa thẳng phần chữ giữa các thẻ.

Thông tin có tính chức năng nằm trong `CONFIG` ở đầu `assets/js/main.js`:

```js
const CONFIG = {
  events: [
    { id: 'sg-party', title: '...', city: 'TP.HCM', countdown: true,
      start: '2026-11-28T18:00:00+07:00', end: '2026-11-28T21:30:00+07:00',
      place: '...', address: '...', map: '...' },
    ...
  ],
  album: [],
  banks: [ ... ],
  music: '',          // đường dẫn file nhạc nền, để trống thì ẩn nút nhạc
  formEndpoint: null  // nơi nhận dữ liệu biểu mẫu
};
```

Mỗi sự kiện trong `events` điều khiển:

- **Lịch cưới** — ngày của mọi sự kiện được khoanh tim, ghi tên `city` bên dưới.
- **Đếm ngược** — chạy tới sự kiện `countdown: true` gần nhất chưa diễn ra; qua
  ngày 28/11 thì tự chuyển sang đếm tới tiệc Hà Nội.
- **Nút trên thẻ tiệc** — `data-map="sg-party"` / `data-cal="sg-party"` trong
  `index.html` trỏ tới sự kiện có `id` tương ứng. `map` là chuỗi tra Google Maps;
  `end` chỉ dùng cho "Thêm vào lịch" (bỏ trống thì mặc định kéo dài 2 giờ).

---

## Tờ giấy nền `main_bg.jpg`

Thiệp luôn nằm trong một cột cỡ điện thoại (`--frame: 480px`) canh giữa màn hình,
hai bên là nền đỏ có tim bay.

`main_bg.jpg` có khung vàng in sẵn, nên không kéo giãn cả ảnh mà cắt kiểu 9 ô bằng
`border-image` (`.paper` trong `style.css`): bốn góc — gồm khung và hoạ tiết góc,
nằm trong 200 px đầu của ảnh 1600 px — giữ nguyên hình, chỉ các cạnh thẳng kéo dài.
Khung vàng vì vậy luôn bao trọn màn hình dù điện thoại cao hay thấp. Một bản sao
`.paper--edge` phủ lên dải trên và dưới để chữ cuộn tới mép thì mờ đi, không đè lên khung.

Bìa có đúng tỉ lệ 2:3 của ảnh và cũng dùng cách cắt 9 ô đó.

---

## Bảng màu và chữ

```css
:root {
  --cream: #efe7dc;     --cream-deep: #e2d8ce;    /* lấy mẫu từ main_bg.jpg */
  --burgundy: #511419;  --burgundy-deep: #3a0d11;  --burgundy-soft: #7a1f26;
  --gold: #c9a24a;      --gold-pale: #e9ce9e;
}
```

Font (Google Fonts, đều có bộ chữ tiếng Việt): **Viaoda Libre** cho tên,
**The Nautigal** cho chữ viết tay, **Cormorant Garamond** cho tiêu đề,
**Lora** cho chữ thường.

**Mọi chữ số đều dùng Lora.** Cormorant Garamond và The Nautigal dùng số kiểu cổ
("11" trông như "ıı", "00" như "oo"), khó đọc. `style.css` khai báo thêm font
`"Thiep Digits"` chỉ chứa chữ số 0–9 (`unicode-range`) và đặt nó đầu các danh sách
font — chữ số hiện bằng Lora, chữ cái vẫn giữ font cũ. Muốn đổi font cho số thì chỉ
cần sửa khối `@font-face` đó.

---

## Nhận phản hồi xác nhận tham dự

Mặc định `formEndpoint: null` — dữ liệu chỉ lưu trong trình duyệt của khách,
**bạn sẽ không nhận được**. Để thu thập thật, cách đơn giản nhất là Google Sheet:

1. Tạo một Google Sheet mới, vào **Tiện ích mở rộng → Apps Script**.
2. Dán đoạn mã sau và lưu:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data  = JSON.parse(e.postData.contents);
     sheet.appendRow([data.at, data.type, data.name, data.side || '',
                      data.attend || '', data.guests || '']);
     return ContentService.createTextOutput('ok');
   }
   ```

3. **Triển khai → Tài nguyên web**, chọn quyền truy cập **Bất kỳ ai**, rồi sao chép URL.
4. Dán URL đó vào `CONFIG.formEndpoint` trong `assets/js/main.js`.

Cột `attend` cho biết khách dự tiệc nào: `TP.HCM 28/11`, `Hà Nội 10/12`, `Cả hai`
hoặc `Không`.

---

## Cấu trúc thư mục

```
index.html              Toàn bộ nội dung thiệp
assets/css/style.css    Bảng màu, bố cục, hiệu ứng
assets/js/main.js       CONFIG + các chức năng
images/main_bg.jpg      Tờ giấy nền có khung vàng
images/Artboard 2.png   Hình minh hoạ cặp đôi
images/PNG 1–4.png      Biểu tượng cho mục Lịch trình
images/album/           Ảnh cưới của bạn — tự tạo thư mục này
images/LICENSES.md      Nguồn gốc và giấy phép của ảnh
```

## Đưa lên mạng

Trang hoàn toàn tĩnh nên bật GitHub Pages là chạy được:
**Settings → Pages → Source: main / root**.

Sau khi có địa chỉ thật, sửa `og:image` trong `index.html` thành đường dẫn đầy đủ
(ví dụ `https://<tên>.github.io/<repo>/images/main_bg.jpg`) — Zalo và Facebook chỉ
hiện ảnh xem trước khi đường dẫn là tuyệt đối.
