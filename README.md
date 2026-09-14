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
- **Hai thứ tiếng** — bìa có hai nút: **Mở thiệp** mở bản tiếng Việt, **Open** mở
  bản tiếng Anh. Xem mục [Hai thứ tiếng](#hai-thứ-tiếng).

| | TP. Hồ Chí Minh — nhà gái | Hà Nội — nhà trai |
|---|---|---|
| Ngày | Thứ Bảy 28 / 11 / 2026 (20 / 10 Bính Ngọ) | Thứ Năm 10 / 12 / 2026 (02 / 11 Bính Ngọ) |
| Sự kiện | **Lễ Vu Quy** — Asiana Plaza, đón khách 18:00, khai tiệc 19:00 | **Lễ Thành Hôn** — Nhà văn hoá thôn Mai Hiên, 12:00 |

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
| 3 | Lời mời | Thẻ **Lễ Vu Quy** (TP.HCM) và **Lễ Thành Hôn** (Hà Nội), mỗi thẻ có nút **Chỉ đường** và **Thêm vào lịch** |
| 4 | Lịch cưới | Lịch tháng 11 và 12 khoanh tim ngày cưới + đếm ngược tới sự kiện gần nhất |
| 5 | Album | **Tự ẩn** khi chưa có ảnh |
| 6 | Xác nhận tham dự | Khách chọn dự TP.HCM, Hà Nội hay cả hai |
| 7 | Hộp quà mừng | **Tự ẩn** khi chưa điền số tài khoản |
| 8 | Cảm ơn | Lời kết |

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
- **Tên sự kiện** — `name` hiện ở đồng hồ đếm ngược ("Lễ Vu Quy"), còn `title` là tên
  khách thấy khi bấm "Thêm vào lịch".

---

## Hai thứ tiếng

Bìa thiệp có hai nút: **Mở thiệp** mở bản tiếng Việt, **Open** mở bản tiếng Anh.
Khách chọn một lần lúc mở thiệp; muốn đổi thì tải lại trang.

Chữ tiếng Việt nằm giữa các thẻ trong `index.html`, bản tiếng Anh nằm ngay cạnh
trong thuộc tính:

```html
<h3 class="party__name" data-en="Vu Quy Ceremony">Lễ Vu Quy</h3>
<p class="party__addr" data-en="Dong Anh Commune, Hanoi<br>(Mai Hien Village...)">Xã Đông Anh, TP. Hà Nội<br>(...)</p>
<input id="rsvpName" placeholder="Nguyễn Văn A" data-en-placeholder="Your name">
<button id="musicBtn" title="Bật / tắt nhạc" data-en-title="Music on / off">♪</button>
```

- `data-en` — chữ tiếng Anh, được phép có thẻ HTML đơn giản (`<br>`, `<small>`).
- `data-en-placeholder` — chữ mờ trong ô nhập.
- `data-en-title` — chữ hiện khi rê chuột (dùng luôn cho `aria-label`).
- Thẻ nào **không có** `data-en` thì giữ nguyên tiếng Việt ở cả hai bản — thêm
  một dòng chữ mới mà quên `data-en` cũng không làm hỏng gì.

Chữ do mã sinh ra nằm trong bảng `T` ở đầu `assets/js/main.js` (tên tháng, thứ
trong tuần, lời nhắn của biểu mẫu, nút sao chép số tài khoản…). Tên sự kiện tiếng
Anh nằm ở `CONFIG.events[].en`, tên bên nhà trai / nhà gái ở `CONFIG.banks[].sideEn`.

**Lưu ý:** phần `value` của các ô chọn trong biểu mẫu luôn giữ tiếng Việt
(`<option value="Nhà trai" data-en="Groom's family">`), nên dù khách xem bản tiếng
Anh thì dữ liệu gửi về Google Sheet vẫn y như cũ.

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

`CONFIG.formEndpoint` trong `assets/js/main.js` đang trỏ tới một Google Sheet qua
Apps Script, xác nhận tham dự sẽ rơi thẳng vào sheet đó. Để trống (`null`) thì dữ
liệu chỉ nằm trong trình duyệt của khách và **bạn sẽ không nhận được**.

Muốn nối sang sheet khác thì làm lại các bước sau:

1. Tạo một Google Sheet mới, vào **Tiện ích mở rộng → Apps Script**.
2. Dán đoạn mã sau và lưu:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data  = JSON.parse(e.postData.contents);

     // Trang có thể gửi hai lần cho chắc (xem phần dưới) — bỏ qua nếu vừa
     // nhận đúng nội dung đó trong vòng 2 phút
     const cache = CacheService.getScriptCache();
     const key = 'rsvp:' + [data.name, data.side, data.attend, data.guests].join('|');
     if (cache.get(key)) return ContentService.createTextOutput('duplicate');
     cache.put(key, '1', 120);

     // Sheet còn trống thì tạo dòng tiêu đề, in đậm và ghim lại
     if (sheet.getLastRow() === 0) {
       sheet.appendRow(['Thời gian', 'Họ và tên', 'Khách của', 'Dự tiệc', 'Số người']);
       sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
       sheet.setFrozenRows(1);
     }

     sheet.appendRow([
       Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm'),
       data.name, data.side || '', data.attend || '', data.guests || ''
     ]);
     return ContentService.createTextOutput('ok');
   }
   ```

3. **Triển khai → Tài nguyên web**, đặt đúng hai mục này rồi sao chép URL (đuôi `/exec`):
   - **Thực thi bằng tên:** *Tôi* — script chạy bằng tài khoản của bạn nên ghi được
     vào sheet, khách không cần đăng nhập.
   - **Ai có quyền truy cập:** *Bất kỳ ai* — **không phải** "Bất kỳ ai có Tài khoản
     Google", vì mục đó vẫn bắt khách đăng nhập.
4. Dán URL đó vào `CONFIG.formEndpoint` trong `assets/js/main.js`.

Kiểm tra trước khi gửi thiệp cho khách: mở thiệp, gửi thử một xác nhận, rồi xem sheet
có thêm dòng không. Nếu địa chỉ sai quyền, trình duyệt bị đá về trang đăng nhập của
Google và dòng dữ liệu không bao giờ tới.

Cột **Dự tiệc** cho biết khách dự tiệc nào: `TP.HCM 28/11`, `Hà Nội 10/12`, `Cả hai`
hoặc `Không` — giữ nguyên tiếng Việt kể cả khi khách xem bản tiếng Anh.

### Trình duyệt trong Messenger, Zalo, Facebook

Khách hay bấm đường dẫn ngay trong Messenger hoặc Zalo, và trình duyệt bên trong
các ứng dụng đó **chặn cách gửi thông thường** — máy tính thì không sao nhưng điện
thoại thì không ghi được dòng nào. Vì vậy `sendForm` trong `main.js` gửi theo ba
bước: cách thường (đọc được kết quả) → `navigator.sendBeacon` (gửi được nhưng
không đọc được) → `fetch` kiểu `no-cors`. Bước nào xong trước thì dừng.

Vì bước 1 có thể đã ghi rồi mà trang không đọc được kết quả, `doPost` ở trên dùng
`CacheService` bỏ qua dòng trùng trong 2 phút — gửi lại cũng chỉ ra một dòng.

**Sửa mã xong phải triển khai lại thì mới có tác dụng:** Triển khai → Quản lý bản
triển khai → bấm bút chì → Phiên bản: *Phiên bản mới* → Triển khai. Địa chỉ `/exec`
giữ nguyên, không cần sửa gì trong `main.js`.

---

## Cấu trúc thư mục

```
index.html              Toàn bộ nội dung thiệp
assets/css/style.css    Bảng màu, bố cục, hiệu ứng
assets/js/main.js       CONFIG + các chức năng
images/main_bg.jpg      Tờ giấy nền có khung vàng
images/Artboard 2.png   Hình minh hoạ cặp đôi
images/PNG 1–4.png      Biểu tượng, hiện chưa dùng
images/album/           Ảnh cưới của bạn — tự tạo thư mục này
images/LICENSES.md      Nguồn gốc và giấy phép của ảnh
```

## Đưa lên mạng

Trang hoàn toàn tĩnh nên bật GitHub Pages là chạy được:
**Settings → Pages → Source: main / root**.

Trang đang chạy tại https://duynguyen1907.github.io/thiep_cuoi_lam_nhi/

Ảnh hiện lên khi gửi đường dẫn qua Messenger / Zalo / Facebook là
`images/og-preview.jpg` (1200×630), khai báo trong thẻ `og:image` bằng **đường dẫn
tuyệt đối** — để đường dẫn tương đối thì các ứng dụng đó không hiện ảnh. Muốn dựng
lại ảnh (đổi tên, đổi ngày): sửa `tools/og-preview.html`, mở bằng máy chủ tĩnh rồi
chụp đúng 1200×630, lưu đè lên `images/og-preview.jpg`.

Nếu đổi sang địa chỉ khác, nhớ sửa `og:image` và `og:url` trong `index.html`.

Facebook và Zalo nhớ ảnh xem trước khá lâu. Sau khi đổi, dán đường dẫn vào
[Sharing Debugger](https://developers.facebook.com/tools/debug/) rồi bấm *Scrape
Again* để chúng lấy ảnh mới.
