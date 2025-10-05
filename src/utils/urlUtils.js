/**
 * URL utility functions
 */

/**
 * Generate URLs from pattern
 * @param {string} pattern - URL pattern with {id} placeholder
 * @param {number} startId - Start ID
 * @param {number} endId - End ID
 * @returns {Array<string>} - Generated URLs
 */
export const generateUrls = (pattern, startId, endId) => {
  if (!pattern || !pattern.includes("{id}")) {
    throw new Error("Pattern must contain {id} placeholder");
  }

  const start = parseInt(startId);
  const end = parseInt(endId);

  if (isNaN(start) || isNaN(end)) {
    throw new Error("Start ID and End ID must be valid numbers");
  }

  if (start > end) {
    throw new Error("Start ID must be less than or equal to End ID");
  }

  const urls = [];
  for (let i = start; i <= end; i++) {
    urls.push(pattern.replace("{id}", i));
  }

  return urls;
};

/**
 * Validate URL pattern
 * @param {string} pattern - URL pattern
 * @returns {boolean} - Valid or not
 */
export const isValidUrlPattern = (pattern) => {
  return pattern && typeof pattern === "string" && pattern.includes("{id}");
};

/**
 * Open URLs in batches
 * @param {Array<string>} urls - URLs to open
 * @param {number} batchSize - Number of URLs to open at once
 * @param {Function} onProgress - Callback for progress updates
 * @returns {Promise<void>}
 */
export const openUrlsInBatches = async (urls, batchSize, onProgress) => {
  const totalBatches = Math.ceil(urls.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, urls.length);
    const batch = urls.slice(start, end);

    // Open URLs in current batch
    for (const url of batch) {
      try {
        if (
          typeof chrome !== "undefined" &&
          chrome.tabs &&
          chrome.tabs.create
        ) {
          await chrome.tabs.create({ url, active: false });
        } else {
          window.open(url, "_blank");
        }
      } catch (error) {
        console.error("Error opening URL:", url, error);
      }
    }

    // Notify progress
    if (onProgress) {
      onProgress({
        currentBatch: i + 1,
        totalBatches,
        urlsOpened: end,
        totalUrls: urls.length,
      });
    }

    // Small delay between batches to avoid overwhelming the browser
    if (i < totalBatches - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

/**
 * Open all URLs at once
 * @param {Array<string>} urls - URLs to open
 * @returns {Promise<void>}
 */
export const openAllUrls = async (urls) => {
  // Nếu có chrome.tabs thì mở tab mới (extension), ngược lại mở bằng window.open (dev/test)
  for (const url of urls) {
    try {
      if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
        await chrome.tabs.create({ url, active: false });
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Error opening URL:", url, error);
    }
  }
};

export default {
  generateUrls,
  isValidUrlPattern,
  openUrlsInBatches,
  openAllUrls,
};
