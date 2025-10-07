/**
 * Instance Manager - Business Logic Layer
 * Single Responsibility: Manage instance operations and state
 *
 * This module handles:
 * - Save/Load instances from storage
 * - Save current tabs to instance (updates lastSavedAt)
 * - Open instance tabs (updates lastOpenedAt)
 * - Create/Delete instances
 * - Track most recently saved/opened instances
 */

import { getFromStorage, saveToStorage } from "./storage";
import { normalizeInstance, createInstance } from "../models/instanceModel";
import { getCurrentWindowTabs, createTabs } from "./tabsApi";

const STORAGE_KEYS = {
  INSTANCES: "instances",
};

/**
 * Get all instances from storage
 * @returns {Promise<Array>} Array of instances
 */
export const getAllInstances = async () => {
  try {
    const instances = await getFromStorage(STORAGE_KEYS.INSTANCES);
    return Array.isArray(instances) ? instances.map(normalizeInstance) : [];
  } catch (error) {
    console.error("Error getting all instances:", error);
    return [];
  }
};

/**
 * Save instance to storage
 * @param {object} instance - Instance to save
 * @returns {Promise<boolean>} Success status
 */
export const saveInstance = async (instance) => {
  try {
    const instances = await getAllInstances();
    const existingIndex = instances.findIndex((i) => i.id === instance.id);

    if (existingIndex >= 0) {
      // Update existing instance
      instances[existingIndex] = {
        ...instance,
        modifiedAt: new Date().toISOString(),
      };
    } else {
      // Add new instance
      instances.push(instance);
    }

    await saveToStorage(STORAGE_KEYS.INSTANCES, instances);
    return true;
  } catch (error) {
    console.error("Error saving instance:", error);
    return false;
  }
};

/**
 * Delete instance by ID
 * @param {string} instanceId - Instance ID to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteInstance = async (instanceId) => {
  try {
    const instances = await getAllInstances();
    const filtered = instances.filter((i) => i.id !== instanceId);
    await saveToStorage(STORAGE_KEYS.INSTANCES, filtered);
    return true;
  } catch (error) {
    console.error("Error deleting instance:", error);
    return false;
  }
};

/**
 * Save current window tabs to an instance
 * Updates instance tabs and lastSavedAt timestamp
 * @param {string} instanceId - Instance ID to save tabs to
 * @returns {Promise<object>} Result {success, message, tabCount}
 */
export const saveCurrentTabsToInstance = async (instanceId) => {
  try {
    const instances = await getAllInstances();
    const instance = instances.find((i) => i.id === instanceId);

    if (!instance) {
      return { success: false, message: "Instance not found" };
    }

    // Get current window tabs (with group info)
    const tabs = await getCurrentWindowTabs();

    if (tabs.length === 0) {
      return { success: false, message: "No tabs to save" };
    }

    // Update instance with current tabs
    instance.tabs = tabs.map(({ url, title, groupId }) => ({
      url,
      title,
      groupId,
    }));
    instance.modifiedAt = new Date().toISOString();
    instance.lastSavedAt = new Date().toISOString(); // Mark as saved

    await saveInstance(instance);

    return {
      success: true,
      message: `Saved ${tabs.length} tab(s) to instance`,
      tabCount: tabs.length,
    };
  } catch (error) {
    console.error("Error saving current tabs to instance:", error);
    return {
      success: false,
      message: error.message || "Failed to save tabs",
    };
  }
};

/**
 * Open instance tabs in current window
 * Updates instance lastOpenedAt timestamp
 * @param {string} instanceId - Instance ID to open
 * @param {boolean} append - If true, append tabs; if false, replace current tabs
 * @returns {Promise<object>} Result {success, message, tabCount}
 */
export const openInstanceTabs = async (instanceId, append = false) => {
  try {
    // Get instance
    const instances = await getAllInstances();
    const instance = instances.find((i) => i.id === instanceId);

    if (!instance) {
      return { success: false, message: "Instance not found" };
    }

    if (!instance.tabs || instance.tabs.length === 0) {
      return { success: false, message: "Instance has no tabs to open" };
    }

    // Create tabs (with append mode)
    await createTabs(instance.tabs, append);

    // Update lastOpenedAt
    instance.lastOpenedAt = new Date().toISOString();
    instance.modifiedAt = new Date().toISOString();
    await saveInstance(instance);

    return {
      success: true,
      message: append
        ? `Appended ${instance.tabs.length} tab(s) from instance`
        : `Opened ${instance.tabs.length} tab(s) from instance`,
      tabCount: instance.tabs.length,
    };
  } catch (error) {
    console.error("Error opening instance tabs:", error);
    return {
      success: false,
      message: error.message || "Failed to open instance tabs",
    };
  }
};

/**
 * Create a new instance with current tabs or empty
 * @param {object} options - Instance options {name, color, icon}
 * @param {boolean} withCurrentTabs - Whether to include current tabs (default: false)
 * @returns {Promise<object>} Created instance
 */
export const createNewInstance = async (
  options = {},
  withCurrentTabs = false
) => {
  try {
    let tabs = [];
    let lastSavedAt = null;

    if (withCurrentTabs) {
      const currentTabs = await getCurrentWindowTabs();
      tabs = currentTabs.map(({ url, title, groupId }) => ({
        url,
        title,
        groupId,
      }));
      lastSavedAt = new Date().toISOString(); // Mark as saved if created with tabs
    }

    const newInstance = createInstance({
      ...options,
      tabs,
      lastSavedAt,
    });

    await saveInstance(newInstance);
    return newInstance;
  } catch (error) {
    console.error("Error creating new instance:", error);
    throw error;
  }
};

/**
 * Initialize instance system
 * Create default instance if no instances exist
 * @returns {Promise<boolean>} Success status
 */
export const initializeInstanceSystem = async () => {
  try {
    const instances = await getAllInstances();

    // If no instances exist, create default instance with current tabs
    if (instances.length === 0) {
      const tabs = await getCurrentWindowTabs();
      const defaultInstance = createInstance({
        name: "Default",
        color: "#1976d2",
        icon: "WorkspacesIcon",
        tabs: tabs.map(({ url, title, groupId }) => ({
          url,
          title,
          groupId,
        })),
        lastSavedAt: new Date().toISOString(), // Mark as saved
      });

      await saveInstance(defaultInstance);
      return true;
    }

    return true;
  } catch (error) {
    console.error("Error initializing instance system:", error);
    return false;
  }
};

export default {
  getAllInstances,
  saveInstance,
  deleteInstance,
  saveCurrentTabsToInstance,
  openInstanceTabs,
  createNewInstance,
  initializeInstanceSystem,
};
