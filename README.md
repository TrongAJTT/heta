# <img src="public/icon48.png" alt="Heta" width="24" height="24" style="vertical-align: middle;"> Heta - Tab Helper

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff.svg)](https://vitejs.dev/)
[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4285f4.svg)](https://developer.chrome.com/docs/extensions/mv3/)

> A simple browser extension for managing tabs and URLs: batch creation, URL extraction, domain blocking, redirects, and profile-based configuration management. Built with React + Vite (Manifest V3) for optimal performance and simplicity.

## ✨ Features

### 🔗 Batch URL Generator

- Generate multiple URLs from patterns using `{id}` or `{idp}` (zero-padded)
- Flexible start/end ID ranges with clear error handling
- Open all URLs or process in batches with progress tracking

### 📋 URL Extractor

- List current window tabs with quick select/deselect and URL filtering
- Export with customizable templates: `<id>`, `<idp>`, `<url>`, `<name>`
- Real-time preview of formatted output

### 🚫 Domain Blocker

- Add/edit/remove blocked domains using `declarativeNetRequest`
- Bulk add domains (one per line) with success/failure feedback
- Copy results for easy sharing

### 🔄 URL Redirects

- Create redirect rules from `fromUrl` → `toUrl` (supports wildcards)
- Bulk import: each line contains `fromUrl toUrl` separated by space
- Visual feedback for bulk operations with copy functionality

### 👤 Profile Management

- Create/load/delete/rename profiles with active status indicators
- Import/Export JSON (supports multiple profiles at once)
- Each profile stores all states of these above features.

## 📸 Screenshots

<div align="center">
  <img src="https://www.trongajtt.com/apps/heta/1-batch.png" alt="HetaFeature" style="width:45%;">
  <img src="https://www.trongajtt.com/apps/heta/2-extract.png" alt="HetaFeature" style="width:45%;">
  <img src="https://www.trongajtt.com/apps/heta/3-blocker.png" alt="HetaFeature" style="width:45%;">
  <img src="https://www.trongajtt.com/apps/heta/4-redirect.png" alt="HetaFeature" style="width:45%;">
  <img src="https://www.trongajtt.com/apps/heta/5-instance.png" alt="HetaFeature" style="width:45%;">
  <img src="https://www.trongajtt.com/apps/heta/6-profile.png" alt="HetaFeature" style="width:45%;">
</div>

## 🛠️ Installation

### Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Build extension**

   ```bash
   npm run build
   ```

   This creates a `dist` folder with production-ready extension files.

3. **Load extension in browser**

   **Chrome/Edge:**

   1. Open `chrome://extensions/` (or `edge://extensions/`)
   2. Enable **Developer mode**
   3. Click **Load unpacked**
   4. Select the `dist` folder

## 🎯 Quick Start

1. **Batch URLs**: Enter pattern like `https://example.com/page/{id}`, set start/end IDs, generate and open in batches
2. **Extractor**: Select tabs, customize export format, then copy/export
3. **Block Sites**: Add domains individually or use "Add multiple" for bulk operations, save to apply
4. **Redirects**: Create rules or import bulk, save to apply
5. **Profiles**: Create profiles with descriptions, save current state, import/export JSON

## 📂 Project Structure

```
heta/
├── public/
│   ├── manifest.json          # Extension manifest
│   ├── icon16.png             # 16x16 icon
│   ├── icon48.png             # 48x48 icon
│   └── icon128.png            # 128x128 icon
├── src/
│   ├── tabs/                  # Main screens
│   │   ├── BatchUrl.jsx       # Batch URL generator
│   │   ├── Extractor.jsx      # URL extraction & export
│   │   ├── BlockSite.jsx      # Domain blocking & bulk add
│   │   ├── Redirect.jsx       # Redirect rules & bulk add
│   │   ├── Instance.jsx       # Instance management
│   │   └── ProfileManager.jsx # Profile management
│   ├── components/            # Reusable UI components
│   │   ├── ExportFormatDialog.jsx
│   │   ├── ToastWithProgress.jsx
│   │   └── ...
│   ├── utils/                 # Utility functions
│   │   ├── storage.js         # Chrome Storage wrapper
│   │   ├── urlUtils.js        # URL utilities
│   │   └── ...
│   ├── constants/             # App constants
│   │   └── ui.js              # UI constants
│   ├── App.jsx                # Main app component
│   ├── App.css                # Styles
│   └── main.jsx               # Entry point
├── dist/                      # Built extension files
├── vite.config.js             # Vite configuration
└── package.json
```

## 🔧 Development

### Development Mode

```bash
npm run dev
```

After code changes:

1. Rebuild: `npm run build`
2. Reload extension in browser

### Production Build

```bash
npm run build
```

## 🎨 Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool & dev server
- **Chrome Extension Manifest V3** - Extension platform
- **Chrome Storage API** - Local storage
- **Material-UI** - Component library
- **CSS3** - Styling with gradients and transitions

## 🚀 Practical Use Cases for Daily Uses

### 1. Workspace Management

| Core Capability            | Feature Name                    | Practical Use Case                                                                                                                                                         |
| :------------------------- | :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instance & Profile Manager | Separate Life & Work            | Create separate profiles: "Work" (only Slack, Jira, company Gmail) and "Personal" (YouTube, Facebook, News). Switch between them with one click to eliminate distractions. |
| Instance Manager           | Restore Study/Research Sessions | After searching for references for a project, Save all 15 tabs as "Research Project A". The next day, simply Restore that Instance to resume where you left off.           |

### 2. Focus Control

| Core Capability  | Feature Name       | Practical Use Case                                                                                                                                                                 |
| :--------------- | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain Blocker   | Deep Work Mode     | Create a "Deep Work" profile and add Block rules for facebook.com, tiktok.com, youtube.com. When this profile is active, access to these sites is blocked so you can stay focused. |
| Redirect Manager | Force Better Tools | Add a redirect rule: typing `a.b` (your own shortcut) in the address bar automatically opens your `app.asana.com/project-dashboard`.                                               |

### 3. Automation

| Core Capability     | Feature Name                    | Practical Use Case                                                                                                                                                                                                 |
| :------------------ | :------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Batch URL Generator | Bulk Product Price Check        | Frequently compare prices across e-commerce sites. Use a pattern with changing product IDs to generate links for 10 different websites, then open them in batches (Batch Size) to avoid overloading your computer. |
| Batch URL Generator | Watch Episodes/Lessons by Index | Need to open episodes 5–12 of a series or an online course? Enter a pattern with the episode ID to generate the exact URLs for all the episodes you need.                                                          |

### 4. Quick Data Collection

| Core Capability | Feature Name               | Practical Use Case                                                                                                                                                                              |
| :-------------- | :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL Extractor   | Build a Reading List       | While browsing you find 20 articles/blog posts to read later. Use the Extractor to quickly capture all URLs with Page Titles and export a clean Markdown list to paste into Notion or Evernote. |
| URL Extractor   | Capture Project References | After finishing a project, use the Extractor to collect all opened reference links in the Chrome window in the format: "[Page Title] - URL" so you can drop them into your documentation.       |

## 💝 Support & Donate

If you find Heta useful, please consider supporting its development:

### ☕ Buy me a coffee

[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-6e5494?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/TrongAJTT)

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/trongajtt)

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 👨‍💻 Author

Developed with ❤️ by [TrongAJTT](https://github.com/TrongAJTT)

---

**Made with React + Vite + Chrome Extension Manifest V3**
