# Test Cases cho Heta Extension

## Unit Test Cases

### URL Utilities (`urlUtils.js`)

#### Test `generateUrls()`

**Test Case 1: Generate URLs thành công**

```javascript
Input:
  pattern: "https://example.com/page/{id}"
  startId: 1
  endId: 3

Expected Output:
  [
    "https://example.com/page/1",
    "https://example.com/page/2",
    "https://example.com/page/3"
  ]

Status: ✅ Pass
```

**Test Case 2: Pattern không có {id}**

```javascript
Input:
  pattern: "https://example.com/page/"
  startId: 1
  endId: 3

Expected Output: Error: "Pattern must contain {id} placeholder"
Status: ✅ Pass
```

**Test Case 3: Start ID > End ID**

```javascript
Input:
  pattern: "https://example.com/page/{id}"
  startId: 5
  endId: 3

Expected Output: Error: "Start ID must be less than or equal to End ID"
Status: ✅ Pass
```

**Test Case 4: Invalid IDs**

```javascript
Input:
  pattern: "https://example.com/page/{id}"
  startId: "abc"
  endId: 3

Expected Output: Error: "Start ID and End ID must be valid numbers"
Status: ✅ Pass
```

**Test Case 5: Single URL (Start = End)**

```javascript
Input:
  pattern: "https://example.com/page/{id}"
  startId: 5
  endId: 5

Expected Output: ["https://example.com/page/5"]
Status: ✅ Pass
```

#### Test `isValidUrlPattern()`

**Test Case 6: Valid pattern**

```javascript
Input: "https://example.com/{id}"
Expected: true
Status: ✅ Pass
```

**Test Case 7: Invalid pattern (no {id})**

```javascript
Input: "https://example.com/"
Expected: false
Status: ✅ Pass
```

**Test Case 8: Null pattern**

```javascript
Input: null
Expected: false
Status: ✅ Pass
```

### Storage Utilities (`storage.js`)

#### Test `saveProfile()` & `getAllProfiles()`

**Test Case 9: Lưu profile mới**

```javascript
Input:
  profile: {
    id: "test-1",
    name: "Test Profile",
    createdAt: "2025-01-01",
    data: { urlPattern: "test/{id}" }
  }

Expected: Profile được thêm vào danh sách
Status: ✅ Pass
```

**Test Case 10: Update profile đã tồn tại**

```javascript
Input:
  profile: {
    id: "test-1", // Cùng ID
    name: "Updated Name",
    data: { urlPattern: "updated/{id}" }
  }

Expected: Profile được cập nhật, không tạo duplicate
Status: ✅ Pass
```

#### Test `deleteProfile()`

**Test Case 11: Xóa profile tồn tại**

```javascript
Input: profileId: "test-1"
Expected: Profile bị xóa khỏi danh sách
Status: ✅ Pass
```

**Test Case 12: Xóa profile không tồn tại**

```javascript
Input: profileId: "non-existent"
Expected: Không có lỗi, danh sách không thay đổi
Status: ✅ Pass
```

## Integration Test Cases

### Batch URL Component

**Test Case 13: Generate và hiển thị URLs**

1. Nhập URL Pattern: `https://test.com/{id}`
2. Nhập Start ID: `1`
3. Nhập End ID: `5`
4. Click "Tạo Links"

Expected:

- Textarea hiển thị 5 URLs
- Không có error message
- Controls để mở links xuất hiện

Status: ✅ Pass

**Test Case 14: Error khi pattern invalid**

1. Nhập URL Pattern: `https://test.com/` (no {id})
2. Nhập Start ID: `1`
3. Nhập End ID: `5`
4. Click "Tạo Links"

Expected:

- Error message: "Pattern must contain {id} placeholder"
- Không generate URLs

Status: ✅ Pass

**Test Case 15: Clear URLs**

1. Generate URLs
2. Click "Xóa"

Expected:

- URLs bị xóa
- Progress reset
- Error message clear

Status: ✅ Pass

**Test Case 16: Mở All URLs**

1. Generate 3 URLs
2. Click "Mở Tất Cả"

Expected:

- 3 tabs mới được mở
- Progress message hiển thị

Status: ✅ Pass

**Test Case 17: Mở theo Batch**

1. Generate 10 URLs
2. Set Batch Size = 3
3. Click "Mở Theo Batch"

Expected:

- Batch 1: 3 URLs (1-3)
- Batch 2: 3 URLs (4-6)
- Batch 3: 3 URLs (7-9)
- Batch 4: 1 URL (10)
- Progress bar cập nhật
- Stats hiển thị đúng

Status: ✅ Pass

### Profile Manager Component

**Test Case 18: Tạo profile mới**

1. Click "+ Tạo Profile Mới"
2. Nhập tên: "Test Profile"
3. Click "Tạo"

Expected:

- Profile mới xuất hiện trong list
- Profile được set làm active
- Input form ẩn đi

Status: ✅ Pass

**Test Case 19: Hủy tạo profile**

1. Click "+ Tạo Profile Mới"
2. Click "Hủy"

Expected:

- Form ẩn
- Không có profile mới

Status: ✅ Pass

**Test Case 20: Load profile**

1. Có ít nhất 2 profiles
2. Click "Tải" trên profile khác

Expected:

- Profile được load
- Active badge chuyển sang profile mới
- Data trong Batch URL tab cập nhật

Status: ✅ Pass

**Test Case 21: Đổi tên profile**

1. Click ✏️ trên profile
2. Nhập tên mới
3. Confirm

Expected:

- Tên profile được cập nhật
- Updated timestamp thay đổi

Status: ✅ Pass

**Test Case 22: Xóa profile**

1. Click 🗑️ trên profile
2. Confirm xóa

Expected:

- Profile bị xóa
- Nếu là active profile, active ID reset
- Danh sách cập nhật

Status: ✅ Pass

**Test Case 23: Lưu profile hiện tại**

1. Thay đổi data trong Batch URL
2. Click "💾 Lưu Profile Hiện Tại"

Expected:

- Profile data được cập nhật
- Updated timestamp thay đổi

Status: ✅ Pass

### Tab Navigation

**Test Case 24: Chuyển tab**

1. Click tab "Profiles"
2. Click tab "Batch URL"

Expected:

- Tab content thay đổi
- Active tab highlight
- Data persist

Status: ✅ Pass

### State Persistence

**Test Case 25: Auto-save current state**

1. Nhập dữ liệu vào form
2. Close popup
3. Reopen popup

Expected:

- Dữ liệu vẫn còn
- State được restore

Status: ✅ Pass

**Test Case 26: Profile data persistence**

1. Tạo và lưu profile
2. Close extension
3. Reopen extension

Expected:

- Profile vẫn tồn tại
- Data đầy đủ

Status: ✅ Pass

## Manual Test Cases

### Browser Compatibility

**Test Case 27: Chrome**

- Load extension
- Test all features
- Check console for errors

Status: ✅ Pass

**Test Case 28: Edge**

- Load extension
- Test all features
- Check console for errors

Status: ✅ Pass

### Performance Test

**Test Case 29: Large batch (100 URLs)**

1. Generate 100 URLs
2. Batch size 10
3. Open in batches

Expected:

- No crashes
- Reasonable performance
- Progress updates smoothly

Status: ✅ Pass

**Test Case 30: Very large batch (1000 URLs)**

1. Generate 1000 URLs
2. Batch size 20
3. Open in batches

Expected:

- Extension handles it
- May be slow but no crash
- Consider warning user about large batches

Status: ⚠️ Warning recommended

### Edge Cases

**Test Case 31: Empty profile name**

1. Try to create profile with empty name

Expected:

- Nothing happens or validation error

Status: ✅ Pass

**Test Case 32: Batch size = 0 or negative**

1. Try to set batch size to 0 or negative

Expected:

- Default to 1 minimum

Status: ✅ Pass

**Test Case 33: Special characters in URL**

1. Pattern with query params: `https://test.com/page?id={id}&type=test`

Expected:

- URLs generated correctly

Status: ✅ Pass

## Test Summary

Total Test Cases: 33

- ✅ Passed: 32
- ⚠️ Warning: 1 (large batch recommendation)
- ❌ Failed: 0

## Recommended Improvements

1. **Add warning** khi generate > 500 URLs
2. **Add confirmation** khi mở > 50 tabs cùng lúc
3. **Add input validation** cho profile name (min length)
4. **Add export/import** profiles feature
5. **Add statistics** tracking (total URLs opened, etc.)
