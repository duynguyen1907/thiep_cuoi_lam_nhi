# Thiệp cưới online — Lâm & Nhi

Thiệp cưới một trang, chạy tĩnh (HTML + CSS + JavaScript thuần), không cần build,
không phụ thuộc thư viện ngoài. Mở `index.html` là chạy được.

Thiết kế theo phong cách tối giản: nền kem, tông đỏ đô, điểm nhấn vàng —
kèm sẵn một bộ nền đỏ để đổi qua lại.

---

## Chạy thử

Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một máy chủ tĩnh để
bản đồ và các đường dẫn hoạt động đúng nhất:

```bash
python -m http.server 8000
# rồi mở http://127.0.0.1:8000
```

---

## Sửa thông tin đám cưới

### 1. Nội dung chữ — sửa trong `index.html`

Mỗi phần được đánh dấu bằng một khối chú thích lớn, sửa thẳng phần chữ bên trong:

| Phần | Nội dung cần thay |
|---|---|
| Bìa thiệp | Tên cô dâu chú rể, ngày cưới |
| 1. Lời mời | Lời mở đầu |
| 2. Nhà trai — Nhà gái | Tên cha mẹ hai bên, tên cô dâu chú rể |
| 3. Sự kiện | Lễ Vu Quy, Lễ Thành Hôn, Tiệc cưới — giờ và địa chỉ |
| 5. Địa điểm | Tên và địa chỉ nhà hàng |
| 7. RSVP | Hạn phản hồi |
| 10. Cảm ơn | Lời kết |

### 2. Thông tin chức năng — sửa trong `assets/js/main.js`

Toàn bộ nằm trong đối tượng `CONFIG` ở đầu file:

```js
const CONFIG = {
  weddingDate:  '2026-12-20T18:00:00+07:00',  // dùng cho đồng hồ đếm ngược
  mapQuery:     '789 Đường DEF, Quận 5, ...', // địa chỉ hiện trên bản đồ
  album:        [ 'images/album/01.jpg', ... ],
  banks:        [ { side, bank, owner, number, qr }, ... ],
  music:        '',                            // đường dẫn file nhạc nền
  formEndpoint: null                           // nơi nhận dữ liệu biểu mẫu
};
```

### 3. Ảnh cưới

Bỏ ảnh vào `images/album/` rồi cập nhật danh sách `CONFIG.album`.
Nên dùng ảnh dọc (tỉ lệ 3:4) và nén xuống dưới 500 KB mỗi ảnh cho nhẹ trang.

---

## Đổi tông màu

Có sẵn hai tông, dùng chung một bộ mã:

| Tông | Cách bật | Nền dùng |
|---|---|---|
| **Kem** (mặc định) | `<html lang="vi" data-theme="cream">` | `bg-cream-*.jpg` |
| **Đỏ** | `<html lang="vi" data-theme="red">` | `bg-red-*.jpg` |

Khách xem thiệp cũng đổi được bằng nút **◐** ở góc dưới bên phải; lựa chọn được
ghi nhớ trong trình duyệt của họ.

## Bề ngang khung thiệp

Thiệp luôn hiển thị trong một cột hẹp cỡ điện thoại, canh giữa màn hình — trên máy
tính cũng vậy, giống các mẫu thiệp cưới online thông thường. Hai bên là nền lót.

Đổi bề rộng cột ở đầu `assets/css/style.css`:

```css
:root {
  --frame: 480px;      /* bề ngang cột thiệp */
  --backdrop: #d9cec2; /* màu nền hai bên, tông kem */
}
```

Khi màn hình hẹp hơn `--frame`, cột tự động chiếm trọn bề ngang nên trên điện thoại
không có viền lót thừa.

---

Muốn chỉnh màu cụ thể thì sửa các biến ở đầu `assets/css/style.css`:

```css
:root {
  --cream-1: #f3e8de;   --cream-2: #ece4d8;
  --burgundy: #511419;  --burgundy-soft: #7a1f26;
  --gold: #c9a24a;      --gold-pale: #e9ce9e;
}
```

---

## Nhận phản hồi RSVP và lời chúc

Mặc định `formEndpoint: null` — dữ liệu chỉ lưu trong trình duyệt của khách,
**bạn sẽ không nhận được**. Để thu thập thật, cách đơn giản nhất là Google Sheet:

1. Tạo một Google Sheet mới, vào **Tiện ích mở rộng → Apps Script**.
2. Dán đoạn mã sau và lưu:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data  = JSON.parse(e.postData.contents);
     sheet.appendRow([data.at, data.type, data.name, data.side || '',
                      data.attend || '', data.guests || '', data.message || '']);
     return ContentService.createTextOutput('ok');
   }
   ```

3. **Triển khai → Tài nguyên web**, chọn quyền truy cập **Bất kỳ ai**, rồi sao chép URL.
4. Dán URL đó vào `CONFIG.formEndpoint` trong `assets/js/main.js`.

Trang gửi bằng `mode: 'no-cors'` nên trình duyệt không đọc được phản hồi —
đây là cách làm thông thường với Apps Script và không ảnh hưởng tới việc ghi dữ liệu.

---

## Cấu trúc thư mục

```
index.html              Toàn bộ nội dung thiệp
assets/css/style.css    Bảng màu, bố cục, hiệu ứng
assets/js/main.js       CONFIG + các chức năng
images/                 Ảnh nền (xem images/LICENSES.md)
images/album/           Ảnh cưới của bạn — tự tạo thư mục này
```

## Bản quyền ảnh

Ảnh nền trong `images/` đều là **Public Domain / CC0** hoặc do dự án tự tạo,
dùng cho mục đích thương mại được. Chi tiết từng file xem `images/LICENSES.md`.
