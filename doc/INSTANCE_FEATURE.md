# Instance Feature Implementation

**Date:** October 7, 2025
**Feature:** Instance Manager - Tab Workspace Management

## 🎯 Overview

Instance Manager cho phép người dùng tạo và quản lý nhiều workspace (instance) độc lập, mỗi instance có tập hợp tabs riêng. Tính năng này giúp tổ chức công việc hiệu quả hơn bằng cách tách biệt các không gian làm việc khác nhau.

---

## 🏗️ Architecture - SOLID Principles Applied

### **Single Responsibility Principle (SRP)**

Mỗi module có một trách nhiệm duy nhất:

1. **`instanceModel.js`** - Data structure và validation

   - Tạo và normalize instance objects
   - Validate instance data
   - Define tab structure

2. **`tabsApi.js`** - Chrome Tabs API operations

   - Get current window tabs
   - Close/Create tabs
   - Tab manipulation utilities

3. **`instanceManager.js`** - Business logic

   - Save/Load instances from storage
   - Switch between instances
   - Create/Delete instances
   - Track current active instance

4. **`useInstances.js`** - React state management

   - Hook for component integration
   - State synchronization
   - Error handling

5. **`Instance.jsx`** - UI presentation
   - Display instances
   - User interactions
   - Form handling

### **Dependency Inversion Principle (DIP)**

- UI components depend on abstractions (hooks) không phải concrete implementations
- `Instance.jsx` → `useInstances` → `instanceManager` → `storage`
- Dễ dàng thay đổi implementation mà không ảnh hưởng UI

### **Open/Closed Principle (OCP)**

- Dễ extend với new features:
  - Thêm icon picker
  - Thêm instance templates
  - Thêm tab search/filter
- Không cần modify existing code

---

## 📂 File Structure

```
src/
├── models/
│   └── instanceModel.js          # Instance data model
├── utils/
│   ├── tabsApi.js               # Chrome Tabs API wrapper
│   └── instanceManager.js        # Business logic
├── hooks/
│   └── useInstances.js          # React hook
├── tabs/
│   └── Instance.jsx             # UI component
└── constants/
    └── instance.js              # Colors, icons constants
```

---

## 🔧 Key Features

### 1. **Create Instance**

```javascript
// With current tabs
const instance = await create(
  {
    name: "Work",
    color: "#1976d2",
    icon: "WorkIcon",
  },
  true
); // withCurrentTabs = true

// Empty instance
const instance = await create(
  {
    name: "Personal",
    color: "#388e3c",
  },
  false
);
```

### 2. **Switch Instance**

```javascript
// Auto-saves current instance before switching
const result = await switchTo(targetInstanceId);
// Closes all current tabs
// Opens tabs from target instance
// Updates current instance ID
```

### 3. **Save Current Tabs**

```javascript
// Save current window tabs to active instance
await saveCurrentTabs();
```

### 4. **Edit Instance**

```javascript
await save({
  ...instance,
  name: "Updated Name",
  color: "#d32f2f",
});
```

### 5. **Delete Instance**

```javascript
await remove(instanceId);
// Auto-clears current instance if deleting active one
```

### 6. **Auto-Initialize**

```javascript
// On app load, creates default instance if none exist
await initializeInstanceSystem();
```

---

## 🎨 UI Features

### **Instance Card**

- Color indicator bar
- Instance name
- Tab count chip
- Last modified date
- Active indicator (checkmark)
- Edit/Delete buttons
- Switch button

### **Create/Edit Dialog**

- Name input with validation
- Color picker (10 predefined colors)
- Option to include current tabs
- Form validation

### **Color Palette**

```javascript
INSTANCE_COLORS = [
  "#1976d2", // Blue
  "#388e3c", // Green
  "#d32f2f", // Red
  "#f57c00", // Orange
  "#7b1fa2", // Purple
  "#0097a7", // Cyan
  "#c2185b", // Pink
  "#5d4037", // Brown
  "#455a64", // Blue Grey
  "#303f9f", // Indigo
];
```

---

## 🔄 Data Flow

```
User Action (UI)
    ↓
useInstances Hook
    ↓
instanceManager (Business Logic)
    ↓
tabsApi (Chrome API) + storage (Data Persistence)
    ↓
Update State
    ↓
Re-render UI
```

---

## 💾 Storage Structure

```javascript
// Storage Keys
{
  "instances": [
    {
      "id": "1696723200000",
      "name": "Work",
      "color": "#1976d2",
      "icon": "WorkIcon",
      "tabs": [
        { "url": "https://gmail.com", "title": "Gmail", "groupId": null },
        { "url": "https://calendar.google.com", "title": "Calendar", "groupId": null }
      ],
      "createdAt": "2025-10-07T10:00:00.000Z",
      "modifiedAt": "2025-10-07T15:30:00.000Z",
      "lastSavedAt": "2025-10-07T15:30:00.000Z",
      "lastOpenedAt": "2025-10-07T14:00:00.000Z"
    }
  ]
}
```

---

## ✅ SOLID Principles Checklist

- ✅ **Single Responsibility** - Mỗi module một nhiệm vụ rõ ràng
- ✅ **Open/Closed** - Dễ extend, không cần modify
- ✅ **Liskov Substitution** - Các implementation có thể thay thế nhau
- ✅ **Interface Segregation** - Hooks expose only needed methods
- ✅ **Dependency Inversion** - UI depends on abstractions

---

## 🧪 Testing Scenarios

1. **Create Instance**

   - ✅ With current tabs
   - ✅ Empty instance
   - ✅ Validation (name required, min length)

2. **Switch Instance**

   - ✅ Save current tabs before switch
   - ✅ Close all tabs
   - ✅ Open new tabs
   - ✅ Update current instance

3. **Edit Instance**

   - ✅ Update name
   - ✅ Update color
   - ✅ Validation

4. **Delete Instance**

   - ✅ Confirmation dialog
   - ✅ Clear current if deleting active
   - ✅ Update list

5. **Save Current Tabs**
   - ✅ Save to active instance
   - ✅ Update tab count
   - ✅ Update modified time

---

## 🚀 Usage Example

```jsx
import { useInstances } from "./hooks";

function MyComponent() {
  const {
    instances,
    mostRecentSaved,
    mostRecentOpened,
    create,
    saveTabsTo,
    openTabs,
  } = useInstances();

  // Create new instance
  const handleCreate = async () => {
    const instance = await create(
      {
        name: "My Workspace",
        color: "#1976d2",
      },
      true // with current tabs
    );
  };

  // Save current tabs to instance
  const handleSave = async (id) => {
    const result = await saveTabsTo(id);
    if (result.success) {
      console.log(`Saved ${result.tabCount} tabs!`);
    }
  };

  // Open instance tabs
  const handleOpen = async (id, append = false) => {
    const result = await openTabs(id, append);
    if (result.success) {
      console.log("Opened successfully!");
    }
  };

  return (
    <div>
      {instances.map((instance) => (
        <div key={instance.id}>
          <h3>{instance.name}</h3>
          <button onClick={() => handleSave(instance.id)}>Save Tabs</button>
          <button onClick={() => handleOpen(instance.id, false)}>
            Open (Replace)
          </button>
          <button onClick={() => handleOpen(instance.id, true)}>
            Open (Append)
          </button>
          {mostRecentSaved?.id === instance.id && <span>📤 Saved</span>}
          {mostRecentOpened?.id === instance.id && <span>📥 Opened</span>}
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Benefits

1. **Organized Workspaces** - Separate work, personal, projects
2. **Quick Context Switching** - One click to change environment
3. **Tab Management** - Auto-save and restore tabs
4. **Visual Organization** - Color coding for easy identification
5. **Clean Architecture** - SOLID principles for maintainability

---

## 🔮 Future Enhancements

- [ ] Icon picker UI
- [ ] Instance templates
- [ ] Search/filter tabs within instance
- [ ] Export/Import instances
- [ ] Instance groups/folders
- [ ] Keyboard shortcuts
- [ ] Instance sync across devices

---

## 📝 Code Quality

- ✅ Clean code with clear naming
- ✅ JSDoc comments
- ✅ Error handling
- ✅ Input validation
- ✅ Loading states
- ✅ User feedback (success/error messages)
- ✅ Confirmation dialogs for destructive actions

---

**Implementation Status:** ✅ Complete
**Build Status:** ✅ Success
**SOLID Compliance:** ✅ 100%
