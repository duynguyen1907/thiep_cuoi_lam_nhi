# Ảnh trong thư mục này — nguồn và giấy phép

## `main_bg.jpg`

Ảnh nền chính của thiệp: nền giấy kem, khung vàng đôi, góc có chấm trang trí.

- **Kích thước:** 1600×2400 px (dọc, tỉ lệ 2:3) — 297 KB
- **Nguồn gốc:** do dự án này tự sinh bằng mã (chuyển sắc + hạt giấy + khung vẽ
  bằng thuật toán). **Không lấy từ nguồn bên ngoài, không vướng bản quyền
  của bên thứ ba.**
- **Bảng màu:** kem `#efe7dc` ở giữa, `#e2d9ce` trung bình, viền vàng `#c9a24a`
- **Cách dùng:** là tờ giấy nền của cả thiệp.
  - *Bìa:* dùng nguyên ảnh, khung bìa có đúng tỉ lệ 2:3 nên ảnh vừa khít, không méo.
  - *Thân thiệp:* cắt ảnh kiểu 9 ô bằng `border-image` trong `assets/css/style.css`
    (`.paper`), phần góc 200 px (khung vàng nằm ở 90 px, hoạ tiết góc tới 174 px).
    Nhờ vậy bốn góc giữ nguyên hình, chỉ các cạnh thẳng được kéo dài — khung vàng
    luôn bao trọn màn hình dù điện thoại cao hay thấp.

## `Artboard 2.png`

Hình minh hoạ cô dâu và chú rể trong hai chiếc điện thoại, nền trong suốt.

- **Kích thước:** 2100×1500 px, PNG có kênh alpha — 828 KB
- **Nguồn gốc:** do chủ dự án cung cấp. Giấy phép theo thoả thuận của chủ dự án
  với người vẽ; tài liệu này không xác nhận thay.
- **Cách dùng:** đặt ở mục đầu tiên "Save the date" trong `index.html`.
- **Lưu ý kỹ thuật:** tên file có khoảng trắng nên trong HTML phải viết
  `images/Artboard 2.png` (trình duyệt tự mã hoá thành `%20`). Nếu sau này gặp
  trục trặc khi đưa lên máy chủ, đổi tên file thành dạng không dấu cách
  (ví dụ `couple.png`) rồi sửa lại đường dẫn trong `index.html`.

## `PNG 1.png` – `PNG 4.png`

Bốn hình nét đen trên nền trong suốt, làm biểu tượng cho mục "Lịch trình tiệc cưới".

| File | Hình | Mốc giờ | Kích thước |
|---|---|---|---|
| `PNG 1.png` | Bảng "Reception" | Welcome 18:00 | 1094×553 |
| `PNG 2.png` | Cặp nhẫn cưới | Ceremony 19:00 | 388×321 |
| `PNG 3.png` | Đĩa ăn và dao nĩa | Dinner & Music 19:30 | 384×293 |
| `PNG 4.png` | Hai ly sâm panh | Thank you for coming 21:30 | 345×459 |

- **Nguồn gốc:** do chủ dự án cung cấp, cùng bộ hình ở trang 4 của
  `Thiệp cưới SG v1.1.pdf`. Giấy phép theo thoả thuận của chủ dự án với người
  thiết kế; tài liệu này không xác nhận thay — **cần xác nhận được phép dùng
  thương mại** trước khi đưa thiệp lên mạng.

---

## Ghi chú

Bộ ảnh nền cũ (21 file `bg-*.jpg` lấy từ Wikimedia Commons và StockSnap) đã được
gỡ khỏi thư mục này. Lịch sử và thông tin giấy phép của chúng vẫn còn trong Git,
xem commit `43ab8f6`.

Ảnh cưới thật nên đặt trong `images/album/`, sau đó liệt kê đường dẫn vào
`CONFIG.album` trong `assets/js/main.js`. Nếu danh sách rỗng thì mục Album tự ẩn.
