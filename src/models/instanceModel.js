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
 * @param {Array} options.tabs - Array of tab objects {url, title}
 * @param {string} options.createdAt - ISO timestamp
 * @param {string} options.modifiedAt - ISO timestamp
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
} = {}) => ({
  id: id || Date.now().toString(),
  name: (name || "Untitled Instance").trim(),
  color: color || "#1976d2", // Default Material-UI blue
  icon: icon || "WorkspacesIcon", // Default icon name
  tabs: Array.isArray(tabs) ? tabs : [],
  createdAt: createdAt || new Date().toISOString(),
  modifiedAt: modifiedAt || new Date().toISOString(),
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
 * @returns {object} Tab object
 */
export const createInstanceTab = (url, title) => ({
  url: url || "",
  title: title || "Untitled",
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

export default {
  createInstance,
  normalizeInstance,
  createInstanceTab,
  validateInstance,
};
