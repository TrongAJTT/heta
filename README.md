# <img src="public/icon48.svg" alt="Heta" width="24" height="24" style="vertical-align: middle;"> Heta - Tab Helper

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff.svg)](https://vitejs.dev/)
[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4285f4.svg)](https://developer.chrome.com/docs/extensions/mv3/)

> Trợ thủ quản lý tab và URL cho trình duyệt: tạo/mở theo lô (batch), trích xuất URL, chặn domain, chuyển hướng, lưu cấu hình theo Profile. Xây dựng trên React + Vite (Manifest V3), tối ưu cho hiệu năng và trải nghiệm đơn giản.

## ✨ Tính năng

### 1) Batch URL

- Tạo nhiều URL từ pattern với `{id}` hoặc `{idp}` (zero-pad)
- Start/End ID linh hoạt, kiểm tra lỗi rõ ràng
- Mở tất cả hoặc mở theo batch size; có hiển thị tiến trình gọn nhẹ

### 2) Extractor (Trích xuất URL)

- Liệt kê tab của cửa sổ hiện tại, chọn/bỏ chọn nhanh, filter theo URL
- Xuất theo Template Format có tham số: `<id>`, `<idp>`, `<url>`, `<name>`
- Preview dữ liệu theo template

### 3) Block Site (Chặn domain)

- Thêm/sửa/xóa domain chặn, lưu và áp dụng bằng `declarativeNetRequest`
- Thêm hàng loạt (Bulk Add) với 1 domain mỗi dòng; hiển thị kết quả thành công/thất bại và hỗ trợ Copy

### 4) Redirect (Chuyển hướng)

- Tạo luật chuyển hướng từ `fromUrl` → `toUrl` (hỗ trợ wildcard ở `fromUrl`)
- Thêm hàng loạt: mỗi dòng gồm 2 phần cách nhau bởi khoảng trắng `fromUrl toUrl`
- Hiển thị kết quả thêm hàng loạt, cho phép Copy

### 5) Profiles (Lưu cấu hình)

- Tạo/nạp/xóa/đổi tên Profile; đánh dấu Profile đang Active
- Import/Export JSON (hỗ trợ nhiều profile 1 lần)
- Mỗi Profile hiện lưu:
  - Batch URL state (pattern, start/end, generated, batch size,...)
  - Extractor Export Format
  - Danh sách Block Site (blocked domains)
  - Danh sách Redirect Rules
  - Mô tả Profile (description)

### 6) Lưu trữ và đồng bộ

- Lưu vào Chrome Storage; tự động khôi phục trạng thái và tab đang mở lần gần nhất

## 🛠️ Cài đặt Development

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Build extension

```bash
npm run build
```

Build sẽ tạo thư mục `dist` chứa extension production-ready.

### 3. Load extension vào browser

**Chrome/Edge:**

1. Mở `chrome://extensions/` (hoặc `edge://extensions/`)
2. Bật **Developer mode**
3. Click **Load unpacked**
4. Chọn thư mục `dist`

Extension sẽ xuất hiện với icon SVG của app.

## 🎯 Sử dụng nhanh

1. Batch: nhập pattern `https://example.com/page/{id}`, nhập Start/End, tạo và mở theo batch
2. Extractor: chọn các tab, chỉnh `Export Format` rồi Copy/Export
3. Block Site: nhập domain hoặc dùng nút “Add multiple” để thêm hàng loạt, Save để áp dụng
4. Redirect: nhập rule hoặc Import hàng loạt, Save để áp dụng
5. Profiles: tạo Profile (có mô tả), Save Current để lưu tất cả cấu hình hiện tại; Import/Export JSON

## 📖 Documentation Index

**[📚 Complete Documentation Index](./DOCS_INDEX.md)** - Tất cả tài liệu ở một nơi

### Core Documentation

- **[🚀 QUICKSTART.md](./QUICKSTART.md)** - Bắt đầu trong 5 phút
- **[📘 USAGE.md](./USAGE.md)** - Hướng dẫn chi tiết
- **[💡 EXAMPLES.md](./EXAMPLES.md)** - Ví dụ thực tế & troubleshooting
- **[✅ CHECKLIST.md](./CHECKLIST.md)** - Installation verification checklist

### 🔧 Technical Documentation

- **[🏗️ ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[BUILD.md](./BUILD.md)** - Build & deployment guide
- **[🧪 TEST_CASES.md](./TEST_CASES.md)** - Test cases đầy đủ

### 📝 Project Info

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project summary
- **[📝 CHANGELOG.md](./CHANGELOG.md)** - Version history
- **[🤝 CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

### Quick Start

1. Click icon extension trên toolbar
2. Batch URL: điền pattern và mở theo nhu cầu
3. Extractor/Block/Redirect: cấu hình và lưu vào Profile nếu cần

## 📂 Cấu trúc Project

```
heta/
├── public/
│   ├── manifest.json          # Extension manifest
│   ├── icon16.png             # Icon 16x16
│   ├── icon48.png             # Icon 48x48
│   └── icon128.png            # Icon 128x128
├── src/
│   ├── tabs/                  # Tabs/Screens
│   │   ├── BatchUrl.jsx       # Batch URL
│   │   ├── Extractor.jsx      # Trích xuất URL + Export Format
│   │   ├── BlockSite.jsx      # Chặn domain + Bulk Add
│   │   ├── Redirect.jsx       # Redirect rules + Bulk Add
│   │   └── ProfileManager.jsx # Quản lý Profiles
│   ├── components/            # Reusable UI pieces
│   │   ├── ProfileImportButton.jsx
│   │   └── ProfileBulkActionsMenu.jsx
│   ├── utils/
│   │   ├── storage.js         # Chrome Storage wrapper
│   │   ├── urlUtils.js        # URL utilities (batch open)
│   │   └── profileIO.js       # Import/Export helpers
│   ├── App.jsx                # Main app component
│   ├── App.css                # Styles
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── package.json
├── README.md
└── USAGE.md                   # Detailed usage guide
```

## 🔧 Development

### Development mode với hot reload

```bash
npm run dev
```

Sau khi thay đổi code:

1. Build lại: `npm run build`
2. Reload extension trong browser

### Build Production

```bash
npm run build
```

## 🎨 Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool & dev server
- **Chrome Extension Manifest V3** - Extension platform
- **Chrome Storage API** - Local storage
- **CSS3** - Styling với gradients và transitions

## 📝 Đã hoàn thiện

✅ Generate Batch URLs từ pattern `{id}`/`{idp}` và mở theo batch
✅ Extractor với Export Format, Preview
✅ Block Site + Bulk Add, áp dụng với `declarativeNetRequest`
✅ Redirect + Bulk Add, hỗ trợ wildcard ở `fromUrl`
✅ Profiles lưu đầy đủ: Batch + Export Format + Block + Redirect + Description
✅ Import/Export Profiles (JSON), Auto-save state
✅ UI hiện đại, hiệu năng tốt; xử lý lỗi rõ ràng

## 🚀 Ví dụ Use Cases

1. **Testing nhiều pages**: Mở nhiều trang sản phẩm, articles, user profiles
2. **API testing**: Kiểm tra nhiều API endpoints với IDs khác nhau
3. **Data scraping**: Mở nhiều pages để thu thập dữ liệu
4. **QA Testing**: Test nhiều URLs với parameters khác nhau
5. **Batch operations**: Bất kỳ tác vụ nào cần mở nhiều URLs theo pattern

## 📄 License

MIT

## 👨‍💻 Tác giả

Developed with ❤️
