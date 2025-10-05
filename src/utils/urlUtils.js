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
 * Calculate batch information
 * @param {number} totalUrls - Total number of URLs
 * @param {number} currentIndex - Current index position
 * @param {number} batchSize - Size of each batch
 * @returns {Object} - Batch information
 */
export const calculateBatchInfo = (totalUrls, currentIndex, batchSize) => {
  const totalBatches = Math.ceil(totalUrls / batchSize);
  const currentBatch = Math.floor(currentIndex / batchSize) + 1;
  const urlsInNextBatch = Math.min(batchSize, totalUrls - currentIndex);
  const isComplete = currentIndex >= totalUrls;

  return {
    totalBatches,
    currentBatch,
    urlsInNextBatch,
    isComplete,
    progress: totalUrls > 0 ? (currentIndex / totalUrls) * 100 : 0,
  };
};

/**
 * Open a single batch of URLs
 * @param {Array<string>} urls - All URLs
 * @param {number} startIndex - Starting index for this batch
 * @param {number} batchSize - Number of URLs to open in this batch
 * @returns {Promise<{newIndex: number, urlsOpened: Array<string>, isComplete: boolean}>}
 */
export const openSingleBatch = async (urls, startIndex, batchSize) => {
  const endIndex = Math.min(startIndex + batchSize, urls.length);
  const batchUrls = urls.slice(startIndex, endIndex);

  // Open URLs in this batch
  for (const url of batchUrls) {
    try {
      // Check if chrome APIs are available (extension context)
      if (typeof chrome !== "undefined" && chrome.tabs) {
        await chrome.tabs.create({ url, active: false });
      } else {
        // Fallback for development mode - open in new window
        window.open(url, "_blank");
      }
      await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay between tabs
    } catch (error) {
      console.error("Error opening URL:", url, error);
    }
  }

  return {
    newIndex: endIndex,
    urlsOpened: batchUrls,
    isComplete: endIndex >= urls.length,
  };
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
  openSingleBatch,
  calculateBatchInfo,
};
