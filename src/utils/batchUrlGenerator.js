/**
 * Batch URL generation service following SOLID principles
 *
 * Single Responsibility: Handles only URL generation and validation
 * Open/Closed: Can be extended with new generation strategies
 * Liskov Substitution: Can be replaced with other generators
 * Interface Segregation: Clean, focused interface
 * Dependency Inversion: Depends on abstractions
 */

export class BatchUrlGenerator {
  /**
   * Generate URLs from pattern and ID range
   * @param {string} pattern - URL pattern with {id} placeholder
   * @param {string|number} startId - Starting ID
   * @param {string|number} endId - Ending ID
   * @returns {Array<string>} Generated URLs
   */
  static generate(pattern, startId, endId) {
    const validation = this.validateInputs(pattern, startId, endId);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const urls = [];
    const start = parseInt(startId);
    const end = parseInt(endId);

    for (let id = start; id <= end; id++) {
      const url = pattern.replace(/{id}/g, id.toString());
      urls.push(url);
    }

    return urls;
  }

  /**
   * Validate input parameters
   * @param {string} pattern - URL pattern
   * @param {string|number} startId - Starting ID
   * @param {string|number} endId - Ending ID
   * @returns {Object} Validation result
   */
  static validateInputs(pattern, startId, endId) {
    if (!pattern || typeof pattern !== "string") {
      return { valid: false, error: "URL pattern is required" };
    }

    if (!pattern.includes("{id}")) {
      return { valid: false, error: "Pattern must contain {id} placeholder" };
    }

    const start = parseInt(startId);
    const end = parseInt(endId);

    if (isNaN(start) || isNaN(end)) {
      return {
        valid: false,
        error: "Start ID and End ID must be valid numbers",
      };
    }

    if (start < 0 || end < 0) {
      return { valid: false, error: "IDs must be non-negative numbers" };
    }

    if (start > end) {
      return {
        valid: false,
        error: "Start ID must be less than or equal to End ID",
      };
    }

    const range = end - start + 1;
    if (range > 10000) {
      return { valid: false, error: "ID range too large (max 10,000 URLs)" };
    }

    return { valid: true };
  }

  /**
   * Check if pattern already contains {id} placeholder
   * @param {string} pattern - URL pattern
   * @returns {boolean} True if contains {id}
   */
  static hasIdPlaceholder(pattern) {
    return pattern && pattern.includes("{id}");
  }

  /**
   * Insert {id} placeholder at cursor position
   * @param {string} pattern - Current pattern
   * @param {number} cursorPos - Cursor position
   * @returns {string} New pattern with {id} inserted
   */
  static insertIdPlaceholder(pattern, cursorPos) {
    if (this.hasIdPlaceholder(pattern)) {
      return pattern; // Don't insert if already exists
    }

    const pos = cursorPos || pattern.length;
    return pattern.slice(0, pos) + "{id}" + pattern.slice(pos);
  }

  /**
   * Calculate batch information
   * @param {number} totalUrls - Total number of URLs
   * @param {number} currentIndex - Current opened index
   * @param {number} batchSize - Batch size
   * @returns {Object} Batch information
   */
  static calculateBatchInfo(totalUrls, currentIndex, batchSize) {
    const totalBatches = Math.ceil(totalUrls / batchSize);
    const currentBatch = Math.min(
      totalBatches,
      Math.ceil((currentIndex + 1) / batchSize)
    );
    const rangeStart = Math.max(1, currentIndex - batchSize + 2);
    const rangeEnd = Math.min(totalUrls, currentIndex + 1);

    return {
      currentBatch,
      totalBatches,
      rangeStart,
      rangeEnd,
      totalUrls,
    };
  }
}

/**
 * URL pattern manager for handling pattern operations
 */
export class UrlPatternManager {
  /**
   * Validate URL pattern format
   * @param {string} pattern - URL pattern
   * @returns {Object} Validation result
   */
  static validatePattern(pattern) {
    if (!pattern || typeof pattern !== "string") {
      return { valid: false, error: "URL pattern is required" };
    }

    if (!pattern.includes("{id}")) {
      return { valid: false, error: "Pattern must contain {id} placeholder" };
    }

    // Basic URL format validation
    const testUrl = pattern.replace("{id}", "1");
    try {
      new URL(testUrl);
      return { valid: true };
    } catch (e) {
      return { valid: false, error: "Invalid URL format" };
    }
  }

  /**
   * Get suggested patterns
   * @returns {Array<Object>} Array of suggested patterns
   */
  static getSuggestedPatterns() {
    return [
      {
        pattern: "https://example.com/page/{id}",
        description: "Basic page pattern",
      },
      {
        pattern: "https://api.example.com/users/{id}",
        description: "API endpoint pattern",
      },
      {
        pattern: "https://github.com/user/repo/issues/{id}",
        description: "GitHub issues pattern",
      },
      {
        pattern: "https://stackoverflow.com/questions/{id}",
        description: "Stack Overflow pattern",
      },
    ];
  }
}

/**
 * Batch URL factory for creating generator instances
 */
export class BatchUrlFactory {
  /**
   * Creates a generator with predefined settings
   * @param {Object} options - Generator options
   * @returns {Object} Generator instance
   */
  static createGenerator(options = {}) {
    const { maxUrls = 10000, defaultBatchSize = 8 } = options;

    return {
      generate: (pattern, startId, endId) =>
        BatchUrlGenerator.generate(pattern, startId, endId),
      validate: (pattern, startId, endId) =>
        BatchUrlGenerator.validateInputs(pattern, startId, endId),
      insertId: (pattern, cursorPos) =>
        BatchUrlGenerator.insertIdPlaceholder(pattern, cursorPos),
      hasId: (pattern) => BatchUrlGenerator.hasIdPlaceholder(pattern),
      calculateBatch: (totalUrls, currentIndex, batchSize) =>
        BatchUrlGenerator.calculateBatchInfo(
          totalUrls,
          currentIndex,
          batchSize
        ),
    };
  }

  /**
   * Creates a pattern manager instance
   * @returns {Object} Pattern manager instance
   */
  static createPatternManager() {
    return {
      validate: (pattern) => UrlPatternManager.validatePattern(pattern),
      getSuggestions: () => UrlPatternManager.getSuggestedPatterns(),
    };
  }
}

/**
 * Batch URL constants
 */
export const BATCH_URL_CONSTANTS = {
  MAX_URLS: 10000,
  DEFAULT_BATCH_SIZE: 8,
  WARNING_THRESHOLD: 500,
  ID_PLACEHOLDER: "{id}",
};

/**
 * Batch URL error messages
 */
export const BATCH_URL_MESSAGES = {
  PATTERN_REQUIRED: "URL pattern is required",
  ID_PLACEHOLDER_REQUIRED: "Pattern must contain {id} placeholder",
  INVALID_NUMBERS: "Start ID and End ID must be valid numbers",
  NEGATIVE_NUMBERS: "IDs must be non-negative numbers",
  INVALID_RANGE: "Start ID must be less than or equal to End ID",
  RANGE_TOO_LARGE: "ID range too large (max 10,000 URLs)",
  INVALID_URL_FORMAT: "Invalid URL format",
};
