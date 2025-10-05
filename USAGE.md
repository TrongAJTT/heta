# Hướng dẫn Cài đặt và Sử dụng Extension

## Cài đặt

### 1. Cài đặt Dependencies

Mở terminal tại thư mục project và chạy:

```bash
npm install
```

### 2. Build Extension

```bash
npm run build
```

Lệnh này sẽ tạo thư mục `dist` chứa extension đã build.

### 3. Load Extension vào Browser

#### Chrome/Edge:

1. Mở browser và truy cập `chrome://extensions/` (hoặc `edge://extensions/`)
2. Bật **Developer mode** ở góc trên bên phải
3. Click **Load unpacked**
4. Chọn thư mục `dist` trong project

Extension sẽ được cài đặt và biểu tượng sẽ xuất hiện trên toolbar.

## Sử dụng

### Tab Batch URL

#### 1. Tạo Batch URLs

1. **URL Pattern**: Nhập pattern URL với `{id}` làm placeholder

   - Ví dụ: `https://example.com/page/{id}`
   - Ví dụ: `https://api.site.com/item?id={id}`

2. **Start ID**: Nhập số ID bắt đầu (ví dụ: 1)

3. **End ID**: Nhập số ID kết thúc (ví dụ: 10)

4. Click **Tạo Links**

Hệ thống sẽ tạo ra các URLs:

```
https://example.com/page/1
https://example.com/page/2
...
https://example.com/page/10
```

#### 2. Mở Links

Có 2 cách mở links:

**Mở Tất Cả**: Mở toàn bộ links cùng một lúc

- Click nút **Mở Tất Cả**
- Tất cả links sẽ được mở trong các tab mới

**Mở Theo Batch**: Mở theo nhóm với số lượng chỉ định

1. Nhập **Batch Size** (ví dụ: 8 để mở 8 links một lần)
2. Click **Mở Theo Batch**
3. Hệ thống sẽ:
   - Mở batch 1: Links 1-8
   - Sau đó mở batch 2: Links 9-16
   - Tiếp tục cho đến hết
   - Hiển thị tiến trình thời gian thực

#### 3. Progress Tracking

Khi mở links theo batch, bạn sẽ thấy:

- Batch hiện tại / Tổng số batch
- Số links đã mở / Tổng số links
- Progress bar trực quan

### Tab Profiles

Profiles cho phép bạn lưu và quản lý nhiều cấu hình khác nhau.

#### 1. Tạo Profile Mới

1. Click **+ Tạo Profile Mới**
2. Nhập tên cho profile
3. Click **Tạo**

Profile sẽ được tạo với state hiện tại (URL pattern, Start/End ID, generated URLs, batch size).

#### 2. Lưu Profile Hiện Tại

1. Đảm bảo bạn đang ở profile muốn lưu (hiển thị "Active")
2. Click **💾 Lưu Profile Hiện Tại**

Mọi thay đổi sẽ được lưu vào profile đang active.

#### 3. Chuyển đổi giữa các Profiles

1. Click nút **Tải** trên profile muốn sử dụng
2. Profile sẽ được load và trở thành active
3. Dữ liệu trong tab Batch URL sẽ được cập nhật

#### 4. Đổi tên Profile

1. Click nút **✏️** trên profile
2. Nhập tên mới
3. Profile sẽ được đổi tên

#### 5. Xóa Profile

1. Click nút **🗑️** trên profile
2. Xác nhận xóa

## Ví dụ Sử dụng

### Ví dụ 1: Mở nhiều trang sản phẩm

```
URL Pattern: https://shop.example.com/product/{id}
Start ID: 100
End ID: 150
Batch Size: 10

→ Tạo 51 links, mở mỗi batch 10 links
```

### Ví dụ 2: Kiểm tra API endpoints

```
URL Pattern: https://api.example.com/users/{id}
Start ID: 1
End ID: 20
Batch Size: 5

→ Tạo 20 API URLs, mở mỗi batch 5 URLs
```

### Ví dụ 3: Sử dụng Profiles

Bạn có thể tạo nhiều profiles cho các use cases khác nhau:

- **Profile "Products"**: shop.example.com/product/{id}, 1-100
- **Profile "API Test"**: api.example.com/endpoint/{id}, 1-50
- **Profile "Articles"**: blog.example.com/post/{id}, 1-200

Chuyển đổi giữa các profiles khi cần.

## Development

Để phát triển và test extension:

```bash
npm run dev
```

Sau đó:

1. Build lại: `npm run build`
2. Reload extension trong browser (click nút reload ở `chrome://extensions/`)

## Lưu ý

- Extension sử dụng Chrome Storage API để lưu dữ liệu
- Dữ liệu được lưu local trên máy của bạn
- Mỗi profile lưu toàn bộ state: URL pattern, IDs, generated URLs, batch size
- Có thể có delay nhỏ giữa các batch để tránh quá tải browser
