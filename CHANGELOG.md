# Changelog

Tất cả các thay đổi quan trọng của project sẽ được ghi lại ở đây.

## [1.0.0] - 2025-10-05

### ✨ Features

#### Batch URL Generator

- ✅ Generate URLs từ pattern với `{id}` placeholder
- ✅ Validate URL pattern (phải chứa `{id}`)
- ✅ Validate Start ID và End ID
- ✅ Error handling với messages rõ ràng
- ✅ Display generated URLs trong textarea
- ✅ Warning cho batches lớn (>500 URLs)

#### Batch Opening

- ✅ **Mở Tất Cả**: Open tất cả URLs cùng lúc
- ✅ **Mở Theo Batch**: Open URLs theo batch size tùy chỉnh
- ✅ Configurable batch size (min: 1)
- ✅ Progress tracking với real-time updates
- ✅ Progress bar visualization
- ✅ Statistics: current batch, total batches, URLs opened
- ✅ Warning khi mở >50 tabs cùng lúc

#### Profile Management

- ✅ Create new profiles với validation
- ✅ Save current state to active profile
- ✅ Load profiles
- ✅ Switch between profiles
- ✅ Rename profiles
- ✅ Delete profiles với confirmation
- ✅ Active profile indicator
- ✅ Profile metadata (created date, updated date)
- ✅ Duplicate name detection
- ✅ Minimum name length validation (2 chars)

#### Storage & Persistence

- ✅ Chrome Storage API integration
- ✅ Storage wrapper utilities
- ✅ Auto-save current working state
- ✅ Persist profiles across sessions
- ✅ Load last state on extension open

#### UI/UX

- ✅ Modern, clean interface
- ✅ Responsive design (500px width)
- ✅ Tab navigation (Batch URL / Profiles)
- ✅ Gradient purple theme
- ✅ Smooth transitions & animations
- ✅ Button hover effects
- ✅ Form validation feedback
- ✅ Empty states
- ✅ SVG icons với gradient
- ✅ Custom scrollbar styling
- ✅ Progress bar animation

### 🛠️ Technical

#### Build & Development

- ✅ React 18 setup
- ✅ Vite 5 build system
- ✅ Chrome Extension Manifest V3
- ✅ Development mode với hot reload
- ✅ Production build optimization
- ✅ Auto-copy manifest & icons to dist

#### Code Quality

- ✅ Component-based architecture
- ✅ Utility functions separation
- ✅ Error handling throughout
- ✅ Input validation
- ✅ Clean, maintainable code
- ✅ Comments and documentation

### 📚 Documentation

- ✅ README.md - Project overview
- ✅ USAGE.md - Detailed usage guide
- ✅ EXAMPLES.md - Real-world examples & troubleshooting
- ✅ QUICKSTART.md - 5-minute getting started
- ✅ TEST_CASES.md - Comprehensive test cases
- ✅ CHANGELOG.md - Version history

### 🎨 Design

- ✅ Gradient purple theme (#667eea → #764ba2)
- ✅ SVG icons (16px, 48px, 128px)
- ✅ Consistent spacing & typography
- ✅ Button styles (primary, success, secondary, danger)
- ✅ Form input styles
- ✅ Card-based layouts

## [Future Versions]

### Planned Features for v1.1.0

- [ ] Export/Import profiles (JSON)
- [ ] Statistics tracking (total URLs opened, most used profiles)
- [ ] URL history
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] URL preview before opening
- [ ] Custom delay between batches
- [ ] Pause/Resume batch opening
- [ ] Multiple `{id}` placeholders support
- [ ] Advanced patterns (e.g., `{id:pad:5}` for zero-padding)

### Planned Features for v1.2.0

- [ ] URL templates library
- [ ] Share profiles via export
- [ ] Auto-increment from last batch
- [ ] Schedule batch opening
- [ ] Integration with bookmarks
- [ ] Firefox support
- [ ] i18n (multi-language support)

### Performance Improvements

- [ ] Virtual scrolling for large URL lists
- [ ] Lazy loading profiles
- [ ] Optimize storage access
- [ ] Background script for heavy operations

### UI Enhancements

- [ ] Drag & drop to reorder profiles
- [ ] Profile tags/categories
- [ ] Search/filter profiles
- [ ] Customizable themes
- [ ] Tooltips and help text
- [ ] Animated tutorials for new users

---

## Version Format

Sử dụng [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

## Types of Changes

- ✨ **Added**: New features
- 🔧 **Changed**: Changes in existing functionality
- 🐛 **Fixed**: Bug fixes
- 🗑️ **Removed**: Removed features
- 🔒 **Security**: Security fixes
- 📚 **Documentation**: Documentation updates
