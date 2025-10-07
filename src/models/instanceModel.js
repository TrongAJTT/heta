/**
 * Instance Model
 * Represents a workspace/session with its own set of tabs
 */

/**
 * Create a new instance
 * @param {object} options - Instance options
 * @param {string} options.id - Unique instance ID
 * @param {string} options.name - Instance name
 * @param {string} options.color - Instance color (hex)
 * @param {string} options.icon - Instance icon name
 * @param {Array} options.tabs - Array of tab objects {url, title, groupId}
 * @param {string} options.createdAt - ISO timestamp
 * @param {string} options.modifiedAt - ISO timestamp
 * @param {string} options.lastSavedAt - ISO timestamp when tabs were last saved
 * @param {string} options.lastOpenedAt - ISO timestamp when instance was last opened
 * @returns {object} Instance object
 */
export const createInstance = ({
  id,
  name,
  color,
  icon,
  tabs,
  createdAt,
  modifiedAt,
  lastSavedAt,
  lastOpenedAt,
} = {}) => ({
  id: id || Date.now().toString(),
  name: (name || "Untitled Instance").trim(),
  color: color || "#1976d2", // Default Material-UI blue
  icon: icon || "WorkspacesIcon", // Default icon name
  tabs: Array.isArray(tabs) ? tabs : [],
  createdAt: createdAt || new Date().toISOString(),
  modifiedAt: modifiedAt || new Date().toISOString(),
  lastSavedAt: lastSavedAt || null, // null means never saved tabs
  lastOpenedAt: lastOpenedAt || null, // null means never opened
});

/**
 * Normalize instance data
 * @param {object} raw - Raw instance data
 * @returns {object} Normalized instance
 */
export const normalizeInstance = (raw) => {
  const base = typeof raw === "object" && raw ? raw : {};
  return createInstance(base);
};

/**
 * Create tab object for instance
 * @param {string} url - Tab URL
 * @param {string} title - Tab title
 * @param {number|null} groupId - Tab group ID (if in a group)
 * @returns {object} Tab object
 */
export const createInstanceTab = (url, title, groupId = null) => ({
  url: url || "",
  title: title || "Untitled",
  groupId: groupId, // Chrome tab group ID
});

/**
 * Validate instance data
 * @param {object} instance - Instance to validate
 * @returns {object} Validation result {isValid, errors}
 */
export const validateInstance = (instance) => {
  const errors = [];

  if (!instance.name || instance.name.trim().length === 0) {
    errors.push("Instance name is required");
  }

  if (instance.name && instance.name.trim().length < 2) {
    errors.push("Instance name must be at least 2 characters");
  }

  if (!instance.color || !/^#[0-9A-F]{6}$/i.test(instance.color)) {
    errors.push("Invalid color format (must be hex color)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get the most recently saved instance
 * @param {Array} instances - Array of instances
 * @returns {object|null} Most recently saved instance or null
 */
export const getMostRecentlySaved = (instances) => {
  if (!Array.isArray(instances) || instances.length === 0) {
    return null;
  }

  return instances.reduce((mostRecent, instance) => {
    if (!instance.lastSavedAt) return mostRecent;
    if (!mostRecent || !mostRecent.lastSavedAt) return instance;

    const instanceTime = new Date(instance.lastSavedAt).getTime();
    const mostRecentTime = new Date(mostRecent.lastSavedAt).getTime();

    return instanceTime > mostRecentTime ? instance : mostRecent;
  }, null);
};

/**
 * Get the most recently opened instance
 * @param {Array} instances - Array of instances
 * @returns {object|null} Most recently opened instance or null
 */
export const getMostRecentlyOpened = (instances) => {
  if (!Array.isArray(instances) || instances.length === 0) {
    return null;
  }

  return instances.reduce((mostRecent, instance) => {
    if (!instance.lastOpenedAt) return mostRecent;
    if (!mostRecent || !mostRecent.lastOpenedAt) return instance;

    const instanceTime = new Date(instance.lastOpenedAt).getTime();
    const mostRecentTime = new Date(mostRecent.lastOpenedAt).getTime();

    return instanceTime > mostRecentTime ? instance : mostRecent;
  }, null);
};

export default {
  createInstance,
  normalizeInstance,
  createInstanceTab,
  validateInstance,
};
