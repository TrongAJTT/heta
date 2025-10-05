# Build & Deployment Guide

## Build Process

### Development Build

```bash
npm run dev
```

Vite dev server sẽ chạy ở `http://localhost:5173` nhưng vì đây là extension nên bạn cần:

1. Build: `npm run build`
2. Load extension từ `dist` folder
3. Sau mỗi thay đổi, build lại và reload extension

### Production Build

```bash
npm run build
```

Tạo optimized build trong folder `dist/` với:

- Minified JavaScript
- Optimized assets
- Manifest.json
- Icons

### Clean Build

```bash
npm run clean     # Xóa dist folder
npm run rebuild   # Clean + Build
```

## Deployment Checklist

### Pre-deployment

- [ ] Test all features
- [ ] Check console cho errors/warnings
- [ ] Test trên Chrome và Edge
- [ ] Verify manifest.json version
- [ ] Update CHANGELOG.md
- [ ] Update version trong package.json

### Build Extension Package

1. **Build production:**

   ```bash
   npm run build
   ```

2. **Verify dist folder chứa:**

   - index.html
   - manifest.json
   - icon16.svg, icon48.svg, icon128.svg
   - assets/ folder

3. **Tạo ZIP file:**
   - Windows: Right-click `dist` folder → Send to → Compressed folder
   - Mac/Linux: `cd dist && zip -r ../heta-extension-v1.0.0.zip .`

### Chrome Web Store (Optional)

Nếu muốn publish lên Chrome Web Store:

1. **Chuẩn bị assets:**

   - Icon 128x128 (đã có)
   - Screenshots (1280x800 hoặc 640x400)
   - Promo images (optional)
   - Detailed description

2. **Tạo developer account:**

   - https://chrome.google.com/webstore/developer/dashboard
   - One-time $5 fee

3. **Upload extension:**

   - ZIP file từ dist
   - Fill in store listing
   - Submit for review

4. **Review process:**
   - Thường mất vài ngày
   - Google sẽ review code
   - Approve hoặc request changes

### Edge Add-ons (Optional)

1. Partner Center: https://partner.microsoft.com/
2. Similar process như Chrome Web Store
3. Free submission

## Local Installation

### Chrome/Edge

1. Mở `chrome://extensions/` hoặc `edge://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `dist` folder

### Updates

Khi update extension:

1. Update version trong `package.json` và `manifest.json`
2. Build: `npm run build`
3. Chrome/Edge sẽ auto-reload extension nếu đã load unpacked
4. Hoặc manually click reload button

## Versioning

Theo [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

1.0.0 → Initial release
1.0.1 → Bug fix
1.1.0 → New feature (backwards compatible)
2.0.0 → Breaking change
```

Update ở 2 nơi:

- `package.json` → "version"
- `public/manifest.json` → "version"

## Distribution

### GitHub Release

1. Tag version:

   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

2. Create GitHub Release
3. Attach ZIP file
4. Include changelog

### Direct Distribution

Share ZIP file trực tiếp:

- Email
- Google Drive / Dropbox
- Company intranet

Users install bằng cách:

1. Extract ZIP
2. Load unpacked in browser

## Build Optimization

### Current optimizations:

- ✅ Vite build optimization
- ✅ React production build
- ✅ Asset minification
- ✅ Code splitting

### Future optimizations:

- [ ] Tree shaking
- [ ] Lazy loading components
- [ ] Image optimization
- [ ] Bundle analysis

## Troubleshooting Build Issues

### Issue: Build fails

**Check:**

- Node version (14+)
- npm version
- Dependencies installed: `npm install`

### Issue: Extension doesn't load

**Check:**

- Manifest.json có trong dist?
- Icons có trong dist?
- Console errors?

### Issue: Changes không reflect

**Solution:**

- Build lại: `npm run build`
- Reload extension manually
- Clear browser cache

## Environment Variables

Hiện tại không cần env vars, nhưng nếu cần:

1. Create `.env`:

   ```
   VITE_API_URL=https://api.example.com
   ```

2. Access trong code:

   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. Add `.env` to `.gitignore`

## CI/CD (Future)

Potential GitHub Actions workflow:

```yaml
name: Build Extension

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v2
        with:
          name: extension
          path: dist/
```

---

**Happy Building! 🚀**
