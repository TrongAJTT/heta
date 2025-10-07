/**
 * Chrome Tabs API utilities for Instance management
 * Single Responsibility: Handle tab operations only
 */

/**
 * Get all tabs in current window with group information
 * @returns {Promise<Array>} Array of tabs {id, url, title, groupId}
 */
export const getCurrentWindowTabs = async () => {
  try {
    // Check if chrome.tabs API is available
    if (typeof chrome !== "undefined" && chrome.tabs) {
      return new Promise((resolve) => {
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
          const filteredTabs = tabs
            .filter((tab) => {
              // Filter out chrome:// and extension:// URLs
              return (
                tab.url &&
                !tab.url.startsWith("chrome://") &&
                !tab.url.startsWith("chrome-extension://")
              );
            })
            .map((tab) => ({
              id: tab.id,
              url: tab.url,
              title: tab.title || "Untitled",
              groupId: tab.groupId !== -1 ? tab.groupId : null, // -1 means no group
            }));
          resolve(filteredTabs);
        });
      });
    }

    // Fallback for non-extension environment (development)
    return [];
  } catch (error) {
    console.error("Error getting current window tabs:", error);
    return [];
  }
};

/**
 * Close tabs by IDs
 * @param {Array<number>} tabIds - Array of tab IDs to close
 * @returns {Promise<boolean>} Success status
 */
export const closeTabs = async (tabIds) => {
  try {
    if (typeof chrome !== "undefined" && chrome.tabs && tabIds.length > 0) {
      return new Promise((resolve) => {
        chrome.tabs.remove(tabIds, () => {
          resolve(true);
        });
      });
    }
    return false;
  } catch (error) {
    console.error("Error closing tabs:", error);
    return false;
  }
};

/**
 * Create tabs from URLs (with append or override mode)
 * @param {Array<object>} tabs - Array of tab objects {url, title, groupId}
 * @param {boolean} append - If true, append tabs; if false, close existing tabs first
 * @returns {Promise<boolean>} Success status
 */
export const createTabs = async (tabs, append = false) => {
  try {
    console.log(
      "createTabs called with append:",
      append,
      "tabs count:",
      tabs.length
    );
    if (typeof chrome !== "undefined" && chrome.tabs && tabs.length > 0) {
      // If not append mode, close all tabs except one first
      if (!append) {
        console.log("Not append mode - closing all tabs except one");
        await closeAllTabsExceptOne();
        // Wait a bit for tabs to close
        await new Promise((resolve) => setTimeout(resolve, 300));
      } else {
        console.log("Append mode - keeping current tabs");
      }

      // Create tabs
      for (const tab of tabs) {
        await new Promise((resolve) => {
          chrome.tabs.create({ url: tab.url, active: false }, () => {
            resolve();
          });
        });
      }

      return true;
    }
    return false;
  } catch (error) {
    console.error("Error creating tabs:", error);
    return false;
  }
};

/**
 * Close all tabs except one
 * @param {number} keepTabId - ID of tab to keep (optional)
 * @returns {Promise<boolean>} Success status
 */
export const closeAllTabsExceptOne = async (keepTabId = null) => {
  try {
    const tabs = await getCurrentWindowTabs();
    if (tabs.length === 0) return false;

    // Determine which tab to keep
    const tabToKeep = keepTabId || tabs[0].id;
    const tabsToClose = tabs
      .filter((tab) => tab.id !== tabToKeep)
      .map((tab) => tab.id);

    if (tabsToClose.length > 0) {
      await closeTabs(tabsToClose);
    }

    return true;
  } catch (error) {
    console.error("Error closing all tabs except one:", error);
    return false;
  }
};

/**
 * Create a new tab with URL
 * @param {string} url - URL to open
 * @returns {Promise<object|null>} Created tab object or null
 */
export const createSingleTab = async (url = "chrome://newtab/") => {
  try {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      return new Promise((resolve) => {
        chrome.tabs.create({ url, active: true }, (tab) => {
          resolve(tab);
        });
      });
    }
    return null;
  } catch (error) {
    console.error("Error creating single tab:", error);
    return null;
  }
};

export default {
  getCurrentWindowTabs,
  closeTabs,
  createTabs,
  closeAllTabsExceptOne,
  createSingleTab,
};
