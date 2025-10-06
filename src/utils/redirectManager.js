/**
 * Redirect manager utility following SOLID principles
 *
 * Single Responsibility: Manages redirect rules storage and Chrome API
 * Open/Closed: Can be extended with new features
 * Dependency Inversion: Uses storage abstraction
 */

import { getFromStorage, saveToStorage } from "./storage";

const STORAGE_KEY = "redirectRules";
const REDIRECT_RULE_ID_OFFSET = 100000; // To avoid conflicts with block rules

/**
 * Get redirect rules from storage
 * @returns {Promise<Array>} Array of redirect rules
 */
export const getRedirectRules = async () => {
  try {
    const rules = await getFromStorage(STORAGE_KEY);
    return rules || [];
  } catch (error) {
    console.error("Failed to get redirect rules:", error);
    return [];
  }
};

/**
 * Save redirect rules to storage
 * @param {Array} rules - Array of redirect rules
 * @returns {Promise<void>}
 */
export const saveRedirectRules = async (rules) => {
  try {
    await saveToStorage(STORAGE_KEY, rules);
  } catch (error) {
    console.error("Failed to save redirect rules:", error);
    throw error;
  }
};

/**
 * Update Chrome declarativeNetRequest rules for redirects
 * @param {Array} rules - Array of redirect rules
 * @returns {Promise<void>}
 */
export const updateRedirectRules = async (rules) => {
  if (!chrome?.declarativeNetRequest) {
    console.warn("declarativeNetRequest API not available");
    return;
  }

  try {
    // Get existing redirect rule IDs
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRedirectRuleIds = existingRules
      .filter((rule) => rule.id >= REDIRECT_RULE_ID_OFFSET)
      .map((rule) => rule.id);

    // Remove old redirect rules
    if (existingRedirectRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRedirectRuleIds,
      });
    }

    // Add new redirect rules
    if (rules.length > 0) {
      const newRules = rules.map((rule, index) => {
        const ruleId = REDIRECT_RULE_ID_OFFSET + index + 1;

        // Create URL filter from pattern
        const urlFilter = rule.fromUrl.includes("*")
          ? rule.fromUrl
          : `*${rule.fromUrl}*`;

        return {
          id: ruleId,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              url: rule.toUrl,
            },
          },
          condition: {
            urlFilter: urlFilter,
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
        };
      });

      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: newRules,
      });
    }

    console.log(`Updated ${rules.length} redirect rules`);
  } catch (error) {
    console.error("Failed to update redirect rules:", error);
    throw error;
  }
};

/**
 * Initialize redirect rules from storage
 * @returns {Promise<void>}
 */
export const initializeRedirectRules = async () => {
  const rules = await getRedirectRules();
  await updateRedirectRules(rules);
};
