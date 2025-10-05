# Examples & Troubleshooting

## 📚 Ví dụ Thực tế

### Ví dụ 1: Kiểm tra Sản phẩm E-commerce

**Mục đích**: Mở nhiều trang sản phẩm để kiểm tra giá và thông tin

```
Profile Name: "Check Products"
URL Pattern: https://shop.example.com/product/{id}
Start ID: 1000
End ID: 1050
Batch Size: 10

→ Tạo 51 links sản phẩm
→ Mở mỗi lần 10 sản phẩm để dễ quản lý
```

### Ví dụ 2: Test API Endpoints

**Mục đích**: Kiểm tra nhiều API endpoints

```
Profile Name: "API Users Test"
URL Pattern: https://jsonplaceholder.typicode.com/users/{id}
Start ID: 1
End ID: 10
Batch Size: 3

→ Mở từng batch 3 API calls
→ Dễ dàng xem response trong browser
```

### Ví dụ 3: Đọc Blog Posts

**Mục đích**: Mở nhiều bài viết blog

```
Profile Name: "Tech Blog"
URL Pattern: https://blog.example.com/post/{id}
Start ID: 200
End ID: 250
Batch Size: 15

→ 51 bài viết
→ Batch size lớn hơn vì chỉ đọc
```

### Ví dụ 4: GitHub Issues

**Mục đích**: Xem nhiều GitHub issues

```
Profile Name: "Project Issues"
URL Pattern: https://github.com/user/repo/issues/{id}
Start ID: 1
End ID: 30
Batch Size: 5

→ Review issues từng batch nhỏ
```

### Ví dụ 5: Social Media Profiles

**Mục đích**: Kiểm tra user profiles

```
Profile Name: "User Profiles"
URL Pattern: https://twitter.com/user{id}
Start ID: 1
End ID: 20
Batch Size: 8
```

## 🎯 Tips & Best Practices

### 1. Chọn Batch Size Phù hợp

- **Batch Size nhỏ (3-5)**:

  - APIs, pages cần tải nặng
  - Khi cần xem kỹ từng page

- **Batch Size trung bình (8-15)**:

  - Websites thông thường
  - Cân bằng giữa tốc độ và quản lý

- **Batch Size lớn (20-50)**:
  - Pages nhẹ, static content
  - Khi máy có RAM đủ mạnh

### 2. Sử dụng Profiles Hiệu quả

- Tạo profile cho mỗi dự án/use case khác nhau
- Đặt tên profile rõ ràng: "Project X - Products", "Testing API", etc.
- Thường xuyên **Lưu Profile** sau khi thay đổi
- Xóa profiles không dùng để giữ danh sách gọn gàng

### 3. URL Pattern Tips

✅ **Đúng:**

```
https://example.com/page/{id}
https://api.site.com/users/{id}/profile
https://example.com/item?id={id}&type=product
```

❌ **Sai:**

```
https://example.com/page/[id]     // Dùng {id}, không phải [id]
https://example.com/page/         // Thiếu {id}
example.com/page/{id}             // Thiếu protocol (https://)
```

### 4. Performance Tips

- Đóng các tabs không cần thiết trước khi mở batch lớn
- Với batch size lớn, browser có thể lag một chút - đây là bình thường
- Nếu mở quá nhiều tabs, một số browser có thể suspend tabs để tiết kiệm RAM

## 🔧 Troubleshooting

### Vấn đề 1: Extension không hiển thị sau khi load

**Giải pháp:**

1. Kiểm tra `dist` folder đã được tạo chưa
2. Chạy lại `npm run build`
3. Reload extension tại `chrome://extensions/`
4. Kiểm tra console có errors không

### Vấn đề 2: URLs không được tạo

**Nguyên nhân:**

- URL Pattern không có `{id}`
- Start ID hoặc End ID không hợp lệ
- Start ID > End ID

**Giải pháp:**

1. Đảm bảo pattern có `{id}`
2. Kiểm tra Start ID ≤ End ID
3. Nhập số hợp lệ cho cả hai IDs

### Vấn đề 3: Links không mở

**Nguyên nhân:**

- Extension không có permission `tabs`
- Browser block popups
- URLs không hợp lệ

**Giải pháp:**

1. Kiểm tra manifest.json có permission `tabs`
2. Cho phép popups từ extension
3. Test với 1-2 URLs trước

### Vấn đề 4: Profile không lưu

**Nguyên nhân:**

- Không click "Lưu Profile Hiện Tại"
- Extension không có permission `storage`

**Giải pháp:**

1. Phải click nút **💾 Lưu Profile Hiện Tại** để lưu
2. Kiểm tra manifest.json có permission `storage`
3. Reload extension

### Vấn đề 5: Extension bị crash khi mở nhiều tabs

**Nguyên nhân:**

- Batch size quá lớn
- Không đủ RAM
- Quá nhiều extensions khác chạy

**Giải pháp:**

1. Giảm batch size xuống
2. Đóng tabs không cần thiết
3. Tắt một số extensions khác
4. Restart browser

### Vấn đề 6: Progress bar không cập nhật

**Nguyên nhân:**

- UI rendering issue
- Batch mở quá nhanh

**Giải pháp:**

- Đây là bình thường với batch nhỏ (mở rất nhanh)
- Với batch lớn, progress bar sẽ hiển thị đầy đủ

### Vấn đề 7: Không thể đổi tên/xóa profile

**Giải pháp:**

1. Đảm bảo click đúng nút (✏️ để đổi tên, 🗑️ để xóa)
2. Với xóa, phải confirm trong popup
3. Reload extension nếu vẫn không được

## 🐛 Debug Mode

Để debug extension:

1. Right-click vào extension popup → **Inspect**
2. Xem Console tab để thấy logs
3. Check Network tab để xem requests
4. Check Application → Storage → Local Storage

## 💡 Advanced Usage

### Sử dụng với DevTools

1. Mở extension popup
2. Right-click → Inspect
3. Trong Console, có thể access:

```javascript
chrome.storage.local.get(null, (data) => console.log(data));
```

### Export/Import Profiles (Manual)

Export:

```javascript
chrome.storage.local.get(["profiles"], (data) => {
  console.log(JSON.stringify(data.profiles));
});
```

Import (paste JSON vào console):

```javascript
const profiles = [
  /* paste your profiles JSON */
];
chrome.storage.local.set({ profiles });
```

## 📞 Support

Nếu gặp vấn đề không được liệt kê ở đây:

1. Check browser console (F12) để xem errors
2. Kiểm tra extension có được enable không
3. Try rebuild: `npm run build`
4. Reload extension tại `chrome://extensions/`
5. Restart browser

## 🔄 Updates

Khi update extension:

1. Pull latest code
2. `npm install` (nếu có dependencies mới)
3. `npm run build`
4. Reload extension tại `chrome://extensions/`
