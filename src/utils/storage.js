import localforage from "localforage";

/**
 * Storage utility wrapper for Chrome Storage API and localForage.
 * Provides convenient methods to work with chrome.storage.local or IndexedDB/localStorage via localForage.
 */

const STORAGE_KEYS = {
  PROFILES: "profiles",
  ACTIVE_PROFILE: "activeProfile",
  CURRENT_STATE: "currentState",
  ACTIVE_TAB: "activeTab",
};

/**
 * Get data from chrome storage
 * @param {string} key - Storage key
 * @returns {Promise<any>} - Stored data
 */
export const getFromStorage = async (key) => {
  try {
    // Nếu có chrome.storage.local thì ưu tiên dùng (extension), ngược lại dùng localForage
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      const result = await chrome.storage.local.get(key);
      return result[key];
    }
    // Dùng localForage cho mọi môi trường khác (IndexedDB/localStorage)
    return await localforage.getItem(key);
  } catch (error) {
    console.error("Error getting from storage:", error);
    return null;
  }
};

/**
 * Save data to chrome storage
 * @param {string} key - Storage key
 * @param {any} value - Data to store
 * @returns {Promise<boolean>} - Success status
 */
export const saveToStorage = async (key, value) => {
  try {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      await chrome.storage.local.set({ [key]: value });
      return true;
    }
    await localforage.setItem(key, value);
    return true;
  } catch (error) {
    console.error("Error saving to storage:", error);
    return false;
  }
};

/**
 * Remove data from chrome storage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} - Success status
 */
export const removeFromStorage = async (key) => {
  try {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      await chrome.storage.local.remove(key);
      return true;
    }
    await localforage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing from storage:", error);
    return false;
  }
};

/**
 * Get all profiles from storage
 * @returns {Promise<Array>} - Array of profiles
 */
export const getAllProfiles = async () => {
  const profiles = await getFromStorage(STORAGE_KEYS.PROFILES);
  return profiles || [];
};

/**
 * Save profile to storage
 * @param {Object} profile - Profile object
 * @returns {Promise<boolean>} - Success status
 */
export const saveProfile = async (profile) => {
  const profiles = await getAllProfiles();
  const existingIndex = profiles.findIndex((p) => p.id === profile.id);

  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }

  return await saveToStorage(STORAGE_KEYS.PROFILES, profiles);
};

/**
 * Delete profile from storage
 * @param {string} profileId - Profile ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteProfile = async (profileId) => {
  const profiles = await getAllProfiles();
  const updatedProfiles = profiles.filter((p) => p.id !== profileId);
  return await saveToStorage(STORAGE_KEYS.PROFILES, updatedProfiles);
};

/**
 * Get active profile ID
 * @returns {Promise<string|null>} - Active profile ID
 */
export const getActiveProfileId = async () => {
  return await getFromStorage(STORAGE_KEYS.ACTIVE_PROFILE);
};

/**
 * Set active profile ID
 * @param {string} profileId - Profile ID
 * @returns {Promise<boolean>} - Success status
 */
export const setActiveProfileId = async (profileId) => {
  return await saveToStorage(STORAGE_KEYS.ACTIVE_PROFILE, profileId);
};

/**
 * Get current working state (not saved in profile)
 * @returns {Promise<Object|null>} - Current state
 */
export const getCurrentState = async () => {
  return await getFromStorage(STORAGE_KEYS.CURRENT_STATE);
};

/**
 * Save current working state
 * @param {Object} state - Current state object
 * @returns {Promise<boolean>} - Success status
 */
export const saveCurrentState = async (state) => {
  return await saveToStorage(STORAGE_KEYS.CURRENT_STATE, state);
};

/**
 * Get active tab
 * @returns {Promise<string|null>} - Active tab name
 */
export const getActiveTab = async () => {
  return await getFromStorage(STORAGE_KEYS.ACTIVE_TAB);
};

/**
 * Save active tab
 * @param {string} tabName - Tab name
 * @returns {Promise<boolean>} - Success status
 */
export const saveActiveTab = async (tabName) => {
  return await saveToStorage(STORAGE_KEYS.ACTIVE_TAB, tabName);
};

export default {
  getFromStorage,
  saveToStorage,
  removeFromStorage,
  getAllProfiles,
  saveProfile,
  deleteProfile,
  getActiveProfileId,
  setActiveProfileId,
  getCurrentState,
  saveCurrentState,
  getActiveTab,
  saveActiveTab,
  STORAGE_KEYS,
};
