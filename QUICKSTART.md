# 🚀 Quick Start Guide

Hướng dẫn nhanh để bắt đầu sử dụng Heta Extension trong 5 phút!

## 📦 Cài đặt (2 phút)

### Bước 1: Build Extension

```bash
cd e:\BrowserExtensions\heta
npm install
npm run build
```

### Bước 2: Load vào Browser

1. Mở Chrome hoặc Edge
2. Vào `chrome://extensions/`
3. Bật **Developer mode** (góc trên phải)
4. Click **Load unpacked**
5. Chọn thư mục `dist`

✅ Xong! Icon **H** màu tím sẽ xuất hiện trên toolbar.

## 🎯 Sử dụng Cơ Bản (3 phút)

### Ví dụ 1: Tạo 10 Links Đơn Giản

1. **Click vào icon extension**
2. **Nhập thông tin:**
   - URL Pattern: `https://example.com/page/{id}`
   - Start ID: `1`
   - End ID: `10`
3. **Click "Tạo Links"**

→ Bạn sẽ thấy 10 URLs trong textarea!

### Ví dụ 2: Mở Links Theo Batch

4. **Set Batch Size:** `3` (mở 3 links mỗi lần)
5. **Click "Mở Theo Batch"**

→ Extension sẽ mở:

- Batch 1: Links 1-3
- Batch 2: Links 4-6
- Batch 3: Links 7-9
- Batch 4: Link 10

Bạn sẽ thấy progress bar và số liệu thống kê!

### Ví dụ 3: Lưu Profile

6. **Chuyển sang tab "Profiles"**
7. **Click "+ Tạo Profile Mới"**
8. **Nhập tên:** `My First Profile`
9. **Click "Tạo"**

→ Profile của bạn đã được lưu! 💾

## 🎓 Next Steps

### Thử các Pattern khác:

**E-commerce:**

```
https://shop.example.com/product/{id}
Start: 100, End: 150
```

**API Testing:**

```
https://jsonplaceholder.typicode.com/posts/{id}
Start: 1, End: 20
```

**GitHub Issues:**

```
https://github.com/microsoft/vscode/issues/{id}
Start: 1000, End: 1010
```

### Tính năng Nâng cao:

1. **Multiple Profiles**: Tạo nhiều profiles cho các projects khác nhau
2. **Batch Size**: Thử nghiệm với các batch size khác nhau (3, 5, 10, 20)
3. **Large Batches**: Tạo 100+ URLs và mở theo batches nhỏ

## 📚 Đọc thêm

- [USAGE.md](./USAGE.md) - Hướng dẫn chi tiết
- [EXAMPLES.md](./EXAMPLES.md) - Ví dụ thực tế & troubleshooting
- [TEST_CASES.md](./TEST_CASES.md) - Test cases đầy đủ

## 💡 Tips

- **Batch Size nhỏ (3-5)**: Cho APIs hoặc pages nặng
- **Batch Size trung bình (8-15)**: Cho websites thông thường
- **Batch Size lớn (20+)**: Cho static content

- **Luôn lưu profile** sau khi thay đổi bằng nút 💾
- **Đặt tên profile rõ ràng** để dễ quản lý

## ❓ Cần giúp đỡ?

Nếu gặp vấn đề:

1. Check [EXAMPLES.md](./EXAMPLES.md) → Troubleshooting section
2. Mở Console (F12) để xem errors
3. Reload extension tại `chrome://extensions/`

---

**Chúc bạn sử dụng vui vẻ! 🎉**
