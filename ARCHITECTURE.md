# Project Structure Overview

Tổng quan về cấu trúc và architecture của Heta Extension.

## 📁 Directory Structure

```
heta/
│
├── public/                      # Static assets
│   ├── manifest.json           # Chrome Extension manifest (Manifest V3)
│   ├── icon16.svg             # Extension icon 16x16
│   ├── icon48.svg             # Extension icon 48x48
│   └── icon128.svg            # Extension icon 128x128
│
├── src/                        # Source code
│   ├── components/            # React components
│   │   ├── BatchUrl.jsx      # Batch URL generator & opener component
│   │   └── ProfileManager.jsx # Profile management component
│   │
│   ├── utils/                 # Utility functions
│   │   ├── storage.js        # Chrome Storage API wrapper
│   │   └── urlUtils.js       # URL generation & opening utilities
│   │
│   ├── App.jsx               # Main application component
│   ├── App.css              # Application styles
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
│
├── index.html                 # HTML template
├── vite.config.js            # Vite build configuration
├── package.json              # Dependencies & scripts
├── .gitignore                # Git ignore rules
│
└── Documentation/             # All documentation files
    ├── README.md             # Project overview & getting started
    ├── QUICKSTART.md         # 5-minute quick start guide
    ├── USAGE.md              # Detailed usage instructions
    ├── EXAMPLES.md           # Real-world examples & troubleshooting
    ├── TEST_CASES.md         # Comprehensive test cases
    ├── BUILD.md              # Build & deployment guide
    ├── CHANGELOG.md          # Version history
    ├── CONTRIBUTING.md       # Contribution guidelines
    └── LICENSE               # MIT License
```

## 🏗️ Architecture

### Component Hierarchy

```
App (main.jsx)
└── App.jsx
    ├── Tab Navigation
    ├── BatchUrl Component
    │   ├── URL Pattern Input
    │   ├── Start/End ID Inputs
    │   ├── Generate Button
    │   ├── URL List Display
    │   ├── Batch Controls
    │   └── Progress Display
    │
    └── ProfileManager Component
        ├── Profile List
        ├── Create Profile Form
        ├── Profile Actions (Load, Rename, Delete)
        └── Save Current Profile Button
```

### Data Flow

```
User Input → Component State → Storage Utilities → Chrome Storage API
                    ↓
            React State Update
                    ↓
            UI Re-render
```

### Storage Structure

```javascript
{
  // Current working state (auto-saved)
  "currentState": {
    "urlPattern": "https://example.com/{id}",
    "startId": "1",
    "endId": "10",
    "generatedUrls": ["url1", "url2", ...],
    "batchSize": 8
  },

  // All saved profiles
  "profiles": [
    {
      "id": "1234567890",
      "name": "Profile 1",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-02T00:00:00Z",
      "data": { /* same structure as currentState */ }
    }
  ],

  // Active profile ID
  "activeProfile": "1234567890"
}
```

## 🔧 Tech Stack Details

### Frontend

- **React 18.2.0** - UI library
- **React DOM 18.2.0** - React renderer
- **CSS3** - Styling (no frameworks, pure CSS)

### Build Tools

- **Vite 5.0.8** - Build tool & dev server
- **@vitejs/plugin-react 4.2.1** - React support for Vite

### Extension Platform

- **Chrome Extension Manifest V3** - Modern extension platform
- **Chrome Storage API** - Local storage
- **Chrome Tabs API** - Opening tabs

### Development

- **@types/chrome** - TypeScript definitions for Chrome APIs
- **@types/react** - TypeScript definitions for React
- **@types/react-dom** - TypeScript definitions for React DOM

## 📦 Key Files Explained

### `manifest.json`

```json
{
  "manifest_version": 3, // Latest manifest version
  "permissions": ["storage", "tabs"], // Required permissions
  "action": {
    "default_popup": "index.html" // Extension popup
  }
}
```

### `vite.config.js`

- Configures Vite build
- Custom plugin to copy manifest & icons to dist
- Output file naming

### `storage.js`

- Wrapper around Chrome Storage API
- CRUD operations for profiles
- Current state management
- Promise-based async functions

### `urlUtils.js`

- URL generation from pattern
- Pattern validation
- Batch opening logic
- Progress tracking

### `BatchUrl.jsx`

- Form inputs for URL pattern & IDs
- URL generation & display
- Batch opening controls
- Progress tracking UI
- Error handling

### `ProfileManager.jsx`

- Profile CRUD operations
- Active profile management
- Profile list display
- Create/rename/delete UI

### `App.jsx`

- Main component
- Tab navigation
- State coordination
- Component integration

## 🎨 Styling Architecture

### Color Scheme

```css
Primary Gradient: #667eea → #764ba2
Success: #28a745
Secondary: #6c757d
Danger: #dc3545
Background: #f5f5f5
Text: #212529, #495057, #6c757d
```

### Layout

- Fixed width: 500px
- Min height: 400px, Max: 600px
- Padding: 16-20px
- Border radius: 4-8px
- Shadows for depth

### Components Styling

- **Buttons**: 4 variants (primary, success, secondary, danger)
- **Forms**: Consistent input styling with focus states
- **Cards**: Used for profiles and sections
- **Progress**: Custom progress bar
- **Tabs**: Active state with border bottom

## 🔄 Build Process

```
1. Source Code (src/)
   ↓
2. Vite Build Process
   - Transpile JSX → JS
   - Bundle modules
   - Minify code
   - Optimize assets
   ↓
3. Custom Plugin
   - Copy manifest.json
   - Copy icons
   ↓
4. Output (dist/)
   - index.html
   - assets/popup.js
   - assets/popup.css
   - manifest.json
   - icons
```

## 🚀 Runtime Flow

```
1. User clicks extension icon
   ↓
2. Chrome loads index.html
   ↓
3. React initializes (main.jsx)
   ↓
4. App.jsx mounts
   ↓
5. Load current state from storage
   ↓
6. Render UI with loaded data
   ↓
7. User interactions
   ↓
8. State updates → Storage updates
   ↓
9. UI re-renders
```

## 🔐 Permissions

### `storage`

- Save/load profiles
- Auto-save current state
- Persistent data across sessions

### `tabs`

- Open URLs in new tabs
- Batch opening functionality
- Background tab creation

## 📊 Performance Considerations

### Optimizations

- React production build (minified)
- Code splitting by Vite
- Efficient re-renders (React hooks)
- Lazy state updates
- Debounced auto-save

### Potential Bottlenecks

- Large URL lists (>1000)
- Many profiles (>100)
- Rapid state updates
- Opening many tabs simultaneously

### Solutions

- Warnings for large batches
- Pagination for profiles (future)
- Virtual scrolling (future)
- Rate limiting tab opening

## 🧪 Testing Strategy

### Manual Testing

- Feature testing
- UI/UX testing
- Cross-browser testing
- Performance testing

### Test Coverage

- URL generation logic
- Storage operations
- Profile management
- Edge cases

### Browser Support

- ✅ Chrome (primary)
- ✅ Edge (tested)
- ❓ Firefox (needs testing - Manifest V2/V3)
- ❌ Safari (different extension API)

## 📈 Scalability

### Current Limits

- No hard limits on URLs or profiles
- Browser memory is the constraint
- Storage quota: ~5MB (Chrome Storage API)

### Future Scalability

- IndexedDB for large datasets
- Cloud sync (optional)
- Compression for storage
- Pagination for lists

## 🔒 Security

### Current

- No external API calls
- All data stored locally
- No user authentication needed
- No sensitive data handling

### Best Practices

- Input validation
- No eval() or innerHTML
- CSP compliant
- Minimal permissions

---

**This structure provides a solid foundation for a scalable, maintainable browser extension! 🎉**
