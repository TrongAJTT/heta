# ✅ Installation & Verification Checklist

Checklist để verify extension được cài đặt và hoạt động đúng.

## 📦 Pre-Installation

### Environment Setup

- [ ] Node.js đã cài đặt (version 14+)
  ```bash
  node --version
  ```
- [ ] npm đã cài đặt
  ```bash
  npm --version
  ```
- [ ] Git đã cài đặt (optional)
  ```bash
  git --version
  ```

### Project Files

- [ ] Đã có thư mục project: `e:\BrowserExtensions\heta`
- [ ] File `package.json` tồn tại
- [ ] File `vite.config.js` tồn tại
- [ ] Thư mục `src/` tồn tại
- [ ] Thư mục `public/` tồn tại

## 🔧 Installation Steps

### Step 1: Install Dependencies

```bash
cd e:\BrowserExtensions\heta
npm install
```

**Verify:**

- [ ] Không có errors
- [ ] Thư mục `node_modules/` được tạo
- [ ] File `package-lock.json` được tạo

### Step 2: Build Extension

```bash
npm run build
```

**Verify:**

- [ ] Build thành công (no errors)
- [ ] Thư mục `dist/` được tạo
- [ ] `dist/` chứa:
  - [ ] `index.html`
  - [ ] `manifest.json`
  - [ ] `icon16.svg`
  - [ ] `icon48.svg`
  - [ ] `icon128.svg`
  - [ ] Thư mục `assets/` với JS và CSS files

### Step 3: Load Extension in Browser

**Chrome:**

- [ ] Mở `chrome://extensions/`
- [ ] Bật **Developer mode** (toggle ở góc trên phải)
- [ ] Click **Load unpacked**
- [ ] Chọn thư mục `e:\BrowserExtensions\heta\dist`
- [ ] Extension xuất hiện với icon **H** màu gradient tím

**Edge:**

- [ ] Mở `edge://extensions/`
- [ ] Bật **Developer mode**
- [ ] Click **Load unpacked**
- [ ] Chọn thư mục `e:\BrowserExtensions\heta\dist`
- [ ] Extension xuất hiện

## 🧪 Feature Verification

### Tab 1: Batch URL

#### Test 1: Generate URLs

- [ ] Click vào extension icon
- [ ] Tab "📋 Batch URL" đang active
- [ ] Nhập URL Pattern: `https://example.com/page/{id}`
- [ ] Nhập Start ID: `1`
- [ ] Nhập End ID: `5`
- [ ] Click **Tạo Links**
- [ ] 5 URLs hiển thị trong textarea:
  ```
  https://example.com/page/1
  https://example.com/page/2
  https://example.com/page/3
  https://example.com/page/4
  https://example.com/page/5
  ```

#### Test 2: Validation

- [ ] Xóa `{id}` khỏi pattern
- [ ] Click **Tạo Links**
- [ ] Error message hiển thị: "Pattern must contain {id} placeholder"

#### Test 3: Open All URLs

- [ ] Generate 3 URLs (Start: 1, End: 3)
- [ ] Click **Mở Tất Cả**
- [ ] 3 tabs mới được mở
- [ ] Progress message hiển thị

#### Test 4: Open In Batches

- [ ] Generate 10 URLs (Start: 1, End: 10)
- [ ] Set Batch Size: `3`
- [ ] Click **Mở Theo Batch**
- [ ] Tabs mở theo batches:
  - [ ] Batch 1: 3 tabs
  - [ ] Batch 2: 3 tabs
  - [ ] Batch 3: 3 tabs
  - [ ] Batch 4: 1 tab
- [ ] Progress bar updates
- [ ] Statistics hiển thị đúng

#### Test 5: Clear URLs

- [ ] Generate URLs
- [ ] Click **Xóa**
- [ ] URLs bị xóa
- [ ] Textarea trống

### Tab 2: Profiles

#### Test 6: Create Profile

- [ ] Click tab **👤 Profiles**
- [ ] Click **+ Tạo Profile Mới**
- [ ] Nhập tên: `Test Profile`
- [ ] Click **Tạo**
- [ ] Profile xuất hiện trong list
- [ ] Badge "Active" hiển thị

#### Test 7: Validation - Empty Name

- [ ] Click **+ Tạo Profile Mới**
- [ ] Để trống tên
- [ ] Click **Tạo**
- [ ] Alert: "Vui lòng nhập tên profile"

#### Test 8: Validation - Short Name

- [ ] Click **+ Tạo Profile Mới**
- [ ] Nhập: `A` (1 ký tự)
- [ ] Click **Tạo**
- [ ] Alert: "Tên profile phải có ít nhất 2 ký tự"

#### Test 9: Validation - Duplicate Name

- [ ] Tạo profile "Test"
- [ ] Click **+ Tạo Profile Mới** lần nữa
- [ ] Nhập: `Test` (trùng tên)
- [ ] Click **Tạo**
- [ ] Alert: "Tên profile đã tồn tại"

#### Test 10: Save Current Profile

- [ ] Switch về tab **Batch URL**
- [ ] Thay đổi URL Pattern
- [ ] Switch về tab **Profiles**
- [ ] Click **💾 Lưu Profile Hiện Tại**
- [ ] Updated date thay đổi

#### Test 11: Load Profile

- [ ] Tạo 2 profiles khác nhau
- [ ] Click **Tải** trên profile thứ 2
- [ ] Active badge chuyển sang profile 2
- [ ] Tab Batch URL cập nhật data

#### Test 12: Rename Profile

- [ ] Click **✏️** trên một profile
- [ ] Nhập tên mới: `Renamed Profile`
- [ ] Tên profile được cập nhật

#### Test 13: Delete Profile

- [ ] Click **🗑️** trên một profile
- [ ] Confirm trong popup
- [ ] Profile bị xóa

### State Persistence

#### Test 14: Auto-Save

- [ ] Nhập data vào Batch URL tab
- [ ] Close extension popup
- [ ] Reopen extension
- [ ] Data vẫn còn (pattern, IDs, URLs)

#### Test 15: Profile Persistence

- [ ] Tạo profile và lưu
- [ ] Close extension
- [ ] Restart browser (optional)
- [ ] Reopen extension
- [ ] Profile vẫn tồn tại với đầy đủ data

## 🎨 UI/UX Verification

### Visual Elements

- [ ] Header màu gradient tím
- [ ] Tab navigation hoạt động smooth
- [ ] Active tab highlighted
- [ ] Buttons có hover effects
- [ ] Input fields có focus states
- [ ] Progress bar animates smoothly
- [ ] Icons hiển thị đúng (H gradient)

### Responsive

- [ ] Extension popup width: 500px
- [ ] Scroll works nếu content dài
- [ ] All elements fit trong popup

### Typography

- [ ] Fonts rõ ràng, dễ đọc
- [ ] Headers nổi bật
- [ ] Labels descriptive

## 🔍 Console Check

### No Errors

- [ ] Right-click extension popup → **Inspect**
- [ ] Mở **Console** tab
- [ ] Không có errors màu đỏ
- [ ] Warnings (nếu có) là harmless

### Storage Check

- [ ] Trong DevTools, mở **Application** tab
- [ ] Navigate to **Storage** → **Local Storage**
- [ ] Click vào extension
- [ ] Thấy keys: `currentState`, `profiles`, `activeProfile`

## 🚀 Performance Check

### Small Batches (10 URLs)

- [ ] Generate instant
- [ ] Open smooth
- [ ] No lag

### Medium Batches (100 URLs)

- [ ] Generate quick (<1s)
- [ ] Open in batches smooth
- [ ] Progress updates

### Large Batches (500+ URLs)

- [ ] Warning hiển thị
- [ ] Generate trong vài giây
- [ ] Browser handles OK (có thể hơi chậm)

## 📱 Browser Compatibility

### Chrome

- [ ] Version: Chrome 90+
- [ ] All features work
- [ ] No console errors

### Edge

- [ ] Version: Edge 90+
- [ ] All features work
- [ ] No console errors

## 🎉 Final Checklist

### Installation

- [ ] ✅ Dependencies installed
- [ ] ✅ Build successful
- [ ] ✅ Extension loaded in browser
- [ ] ✅ Icon hiển thị

### Core Features

- [ ] ✅ URL generation works
- [ ] ✅ Batch opening works
- [ ] ✅ Progress tracking works
- [ ] ✅ Profile CRUD works
- [ ] ✅ State persistence works

### Quality

- [ ] ✅ No console errors
- [ ] ✅ UI looks good
- [ ] ✅ Performance acceptable
- [ ] ✅ Validation works

### Documentation

- [ ] ✅ README read
- [ ] ✅ QUICKSTART reviewed
- [ ] ✅ USAGE understood

## 🎊 Success!

Nếu tất cả checkboxes được tick ✅:

**🎉 Congratulations! Extension đã được cài đặt và hoạt động hoàn hảo!**

---

## 🐛 Troubleshooting

Nếu có checkbox chưa pass, xem:

- **EXAMPLES.md** → Troubleshooting section
- **BUILD.md** → Build issues
- Console errors trong DevTools

---

_Happy URL Batching! 🚀_
