/**
 * Instance Manager - Business Logic Layer
 * Single Responsibility: Manage instance operations and state
 *
 * This module handles:
 * - Save/Load instances from storage
 * - Switch between instances
 * - Create/Delete instances
 * - Track current active instance
 */

import { getFromStorage, saveToStorage } from "./storage";
import { normalizeInstance, createInstance } from "../models/instanceModel";
import {
  getCurrentWindowTabs,
  closeAllTabsExceptOne,
  createTabs,
} from "./tabsApi";

const STORAGE_KEYS = {
  INSTANCES: "instances",
  CURRENT_INSTANCE_ID: "currentInstanceId",
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

    // If deleted instance was current, clear current instance
    const currentId = await getCurrentInstanceId();
    if (currentId === instanceId) {
      await setCurrentInstanceId(null);
    }

    return true;
  } catch (error) {
    console.error("Error deleting instance:", error);
    return false;
  }
};

/**
 * Get current active instance ID
 * @returns {Promise<string|null>} Current instance ID
 */
export const getCurrentInstanceId = async () => {
  try {
    return await getFromStorage(STORAGE_KEYS.CURRENT_INSTANCE_ID);
  } catch (error) {
    console.error("Error getting current instance ID:", error);
    return null;
  }
};

/**
 * Set current active instance ID
 * @param {string|null} instanceId - Instance ID to set as current
 * @returns {Promise<boolean>} Success status
 */
export const setCurrentInstanceId = async (instanceId) => {
  try {
    await saveToStorage(STORAGE_KEYS.CURRENT_INSTANCE_ID, instanceId);
    return true;
  } catch (error) {
    console.error("Error setting current instance ID:", error);
    return false;
  }
};

/**
 * Save current window tabs to instance
 * @param {string} instanceId - Instance ID to save tabs to
 * @returns {Promise<boolean>} Success status
 */
export const saveCurrentTabsToInstance = async (instanceId) => {
  try {
    const instances = await getAllInstances();
    const instance = instances.find((i) => i.id === instanceId);

    if (!instance) {
      throw new Error("Instance not found");
    }

    // Get current window tabs
    const tabs = await getCurrentWindowTabs();

    // Update instance with current tabs
    instance.tabs = tabs.map(({ url, title }) => ({ url, title }));
    instance.modifiedAt = new Date().toISOString();

    await saveInstance(instance);
    return true;
  } catch (error) {
    console.error("Error saving current tabs to instance:", error);
    return false;
  }
};

/**
 * Switch to a different instance
 * This will:
 * 1. Save current tabs to current instance (if any)
 * 2. Close all tabs except one
 * 3. Load tabs from target instance
 * 4. Set target instance as current
 *
 * @param {string} targetInstanceId - Instance ID to switch to
 * @returns {Promise<object>} Result {success, message}
 */
export const switchToInstance = async (targetInstanceId) => {
  try {
    // Get current instance ID
    const currentId = await getCurrentInstanceId();

    // Save current tabs to current instance before switching
    if (currentId) {
      await saveCurrentTabsToInstance(currentId);
    }

    // Get target instance
    const instances = await getAllInstances();
    const targetInstance = instances.find((i) => i.id === targetInstanceId);

    if (!targetInstance) {
      return { success: false, message: "Target instance not found" };
    }

    // Close all tabs except one
    await closeAllTabsExceptOne();

    // Wait a bit for tabs to close
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Create tabs from target instance
    if (targetInstance.tabs && targetInstance.tabs.length > 0) {
      await createTabs(targetInstance.tabs);
    }

    // Set target instance as current
    await setCurrentInstanceId(targetInstanceId);

    return {
      success: true,
      message: `Switched to instance: ${targetInstance.name}`,
    };
  } catch (error) {
    console.error("Error switching to instance:", error);
    return {
      success: false,
      message: error.message || "Failed to switch instance",
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

    if (withCurrentTabs) {
      tabs = await getCurrentWindowTabs();
    }

    const newInstance = createInstance({
      ...options,
      tabs: tabs.map(({ url, title }) => ({ url, title })),
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
        name: "Default Instance",
        color: "#1976d2",
        icon: "WorkspacesIcon",
        tabs: tabs.map(({ url, title }) => ({ url, title })),
      });

      await saveInstance(defaultInstance);
      await setCurrentInstanceId(defaultInstance.id);

      return true;
    }

    // If current instance is not set, set the first one
    const currentId = await getCurrentInstanceId();
    if (!currentId && instances.length > 0) {
      await setCurrentInstanceId(instances[0].id);
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
  getCurrentInstanceId,
  setCurrentInstanceId,
  saveCurrentTabsToInstance,
  switchToInstance,
  createNewInstance,
  initializeInstanceSystem,
};
