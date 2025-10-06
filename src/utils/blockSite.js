import { getFromStorage, saveToStorage } from "./storage";

const STORAGE_KEY = "blockedDomains";
const RULESET_ID = "block_domains";

/**
 * Get blocked domains from storage
 * @returns {Promise<Array>} - Array of blocked domain objects
 */
export const getBlockedDomains = async () => {
  const domains = await getFromStorage(STORAGE_KEY);
  return domains || [];
};

/**
 * Save blocked domains to storage
 * @param {Array} domains - Array of blocked domain objects
 * @returns {Promise<boolean>} - Success status
 */
export const saveBlockedDomains = async (domains) => {
  return await saveToStorage(STORAGE_KEY, domains);
};

/**
 * Convert domain to URL pattern for blocking
 * @param {string} domain - Domain to block
 * @returns {string} - URL pattern
 */
const domainToUrlPattern = (domain) => {
  // Block both http and https, and all paths under the domain
  return `*://*.${domain}/*`;
};

/**
 * Update Chrome declarativeNetRequest rules based on blocked domains
 * @param {Array} blockedDomains - Array of blocked domain objects
 * @returns {Promise<Object>} - Result object with success status
 */
export const updateBlockRules = async (blockedDomains) => {
  try {
    // Check if we're in a Chrome extension environment
    if (typeof chrome === "undefined" || !chrome.declarativeNetRequest) {
      console.warn("declarativeNetRequest API not available");
      return {
        success: false,
        error: "This feature requires Chrome extension environment",
      };
    }

    // Get existing dynamic rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map((rule) => rule.id);

    // Remove all existing rules
    if (existingRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
      });
    }

    // If there are no domains to block, we're done
    if (!blockedDomains || blockedDomains.length === 0) {
      return { success: true };
    }

    // Create new rules for each blocked domain
    const newRules = [];
    blockedDomains.forEach((domainObj, index) => {
      const domain = domainObj.domain;

      // Rule to block the main domain and all subdomains
      newRules.push({
        id: index + 1,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: `*://*.${domain}/*`,
          resourceTypes: [
            "main_frame",
            "sub_frame",
            "stylesheet",
            "script",
            "image",
            "font",
            "object",
            "xmlhttprequest",
            "ping",
            "csp_report",
            "media",
            "websocket",
            "webtransport",
            "webbundle",
            "other",
          ],
        },
      });

      // Also block the domain without subdomain
      newRules.push({
        id: blockedDomains.length + index + 1,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: `*://${domain}/*`,
          resourceTypes: [
            "main_frame",
            "sub_frame",
            "stylesheet",
            "script",
            "image",
            "font",
            "object",
            "xmlhttprequest",
            "ping",
            "csp_report",
            "media",
            "websocket",
            "webtransport",
            "webbundle",
            "other",
          ],
        },
      });
    });

    // Add new rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: newRules,
    });

    console.log(`Successfully applied ${newRules.length} blocking rules`);
    return { success: true };
  } catch (error) {
    console.error("Error updating block rules:", error);
    return {
      success: false,
      error: error.message || "Failed to update blocking rules",
    };
  }
};

/**
 * Clear all blocking rules
 * @returns {Promise<Object>} - Result object with success status
 */
export const clearAllBlockRules = async () => {
  try {
    if (typeof chrome === "undefined" || !chrome.declarativeNetRequest) {
      return {
        success: false,
        error: "This feature requires Chrome extension environment",
      };
    }

    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map((rule) => rule.id);

    if (existingRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
      });
    }

    await saveBlockedDomains([]);
    return { success: true };
  } catch (error) {
    console.error("Error clearing block rules:", error);
    return {
      success: false,
      error: error.message || "Failed to clear blocking rules",
    };
  }
};

export default {
  getBlockedDomains,
  saveBlockedDomains,
  updateBlockRules,
  clearAllBlockRules,
};
