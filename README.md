# <img src="public/icon48.svg" alt="Heta" width="24" height="24" style="vertical-align: middle;"> Heta - Tab Helper Extension

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff.svg)](https://vitejs.dev/)
[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4285f4.svg)](https://developer.chrome.com/docs/extensions/mv3/)

Browser extension để quản lý và mở batch URLs với hỗ trợ profiles. Được xây dựng với React + Vite để nhỏ gọn và hiệu quả.

## ✨ Tính năng

### Batch URL Generator

- Tạo nhiều URLs từ pattern với `{id}` placemarkdownholder
- Hỗ trợ Start ID và End ID linh hoạt
- Validate input và hiển thị errors rõ ràng
- Hiển thị tất cả URLs đã tạo trong textarea, có thể chỉnh sửa trực tiếp và cuộn bằng con lăn

### Batch Opening

- **Mở Tất Cả**: Mở toàn bộ URLs cùng lúc
- **Open Each**: Mở URLs theo từng đợt (batch) với batch size tùy chỉnh, mỗi lần bấm mở một batch
- Progress hiển thị tối giản: “Opened batch X of Y (a-b of N)” + thanh tiến trình mảnh

### Profile Management

- Tạo và lưu nhiều profiles
- Mỗi profile lưu: URL pattern, Start/End ID, generated URLs, batch size
- Chuyển đổi nhanh giữa các profiles
- Đổi tên và xóa profiles
- Hiển thị profile đang active
- Auto-save state hiện tại
- Import/Export profile (JSON). Hỗ trợ Batch Import/Export qua menu (...)

### Local Storage

- Sử dụng Chrome Storage API
- Lưu trữ profiles và state local
- Wrapper utilities tiện lợi

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

## 🎯 Sử dụng

Xem [📚 DOCS_INDEX.md](./DOCS_INDEX.md) để navigate qua tất cả tài liệu.

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

1. Click vào icon extension trên toolbar
2. Nhập URL Pattern: `https://example.com/page/{id}`
3. Nhập Start ID: `1` và End ID: `10`
4. Click **Tạo Links**
5. Chọn batch size (ví dụ: `8`)
6. Click **Mở Theo Batch** để mở links theo nhóm

## 📂 Cấu trúc Project

```
heta/
├── public/
│   ├── manifest.json          # Extension manifest
│   ├── icon16.svg             # Icon 16x16
│   ├── icon48.svg             # Icon 48x48
│   └── icon128.svg            # Icon 128x128
├── src/
│   ├── tabs/                  # Tab/screens (high-level)
│   │   ├── BatchUrl.jsx       # Batch URL tab (re-export)
│   │   └── ProfileManager.jsx # Profiles tab (re-export)
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

## 📝 Tính năng Đã Implement

✅ Generate batch URLs từ pattern với {id}
✅ Validate URL pattern và IDs
✅ Mở tất cả URLs hoặc theo batch size
✅ Progress tracking tối giản + thanh tiến trình mảnh
✅ Textarea batch links có thể chỉnh sửa và cuộn bằng chuột
✅ Batch Import/Export profiles qua menu (...)
✅ Profile system với CRUD operations
✅ Auto-save current state
✅ Chrome Storage integration
✅ Responsive UI với modern design
✅ Error handling và validation
✅ SVG icons với gradient

## 🚀 Ví dụ Use Cases

1. **Testing nhiều pages**: Mở nhiều trang sản phẩm, articles, user profiles
2. **API testing**: Kiểm tra nhiều API endpoints với IDs khác nhau
3. **Data scraping**: Mở nhiều pages để thu thập dữ liệu
4. **QA Testing**: Test nhiều URLs với parameters khác nhau
5. **Batch operations**: Bất kỳ tác vụ nào cần mở nhiều URLs theo pattern

## 📄 License

MIT

## 👨‍💻 Author

Developed with ❤️
