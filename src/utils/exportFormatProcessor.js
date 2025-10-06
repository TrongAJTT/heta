/**
 * Export format processor following SOLID principles
 *
 * Single Responsibility: Handles only export format processing
 * Open/Closed: Can be extended with new parameters without modifying existing code
 * Liskov Substitution: Can be replaced with other format processors
 * Interface Segregation: Clean, focused interface
 * Dependency Inversion: Depends on abstractions, not concrete implementations
 */

export class ExportFormatProcessor {
  /**
   * Available format parameters
   */
  static PARAMETERS = {
    ID: "<id>",
    ID_PADDED: "<idp>",
    URL: "<url>",
    NAME: "<name>",
  };

  /**
   * Process format template with tab data
   * @param {string} template - Format template string
   * @param {Array} tabs - Array of tab objects
   * @param {Object} options - Processing options
   * @returns {Array} Formatted strings
   */
  static process(template, tabs, options = {}) {
    const { paddingLength = 2 } = options;

    return tabs.map((tab, index) => {
      let formatted = template;

      // Replace placeholders with actual values
      formatted = formatted.replace(/<id>/g, index + 1);
      formatted = formatted.replace(
        /<idp>/g,
        this.padIndex(index + 1, paddingLength)
      );
      formatted = formatted.replace(/<url>/g, tab.url);
      formatted = formatted.replace(/<name>/g, tab.title || "Untitled");

      return formatted;
    });
  }

  /**
   * Pad index with leading zeros
   * @param {number} index - Index to pad
   * @param {number} length - Target length
   * @returns {string} Padded index string
   */
  static padIndex(index, length = 2) {
    return index.toString().padStart(length, "0");
  }

  /**
   * Get available parameters list
   * @returns {Array} Array of parameter objects
   */
  static getAvailableParameters() {
    return [
      { key: "<id>", description: "Index number (1, 2, 3...)" },
      { key: "<idp>", description: "Zero-padded index (01, 02, 03...)" },
      { key: "<url>", description: "Full URL of the tab" },
      { key: "<name>", description: "Page title" },
    ];
  }

  /**
   * Get example formats
   * @returns {Array} Array of example objects
   */
  static getExamples() {
    return [
      { template: "<url>", result: "https://example.com" },
      { template: "<id>. <name>", result: "1. Example Page" },
      { template: "<idp>. <name>", result: "01. Example Page" },
      {
        template: "<id>. <name> - <url>",
        result: "1. Example Page - https://example.com",
      },
      {
        template: "<name> (<url>)",
        result: "Example Page (https://example.com)",
      },
    ];
  }

  /**
   * Validate template format
   * @param {string} template - Template to validate
   * @returns {Object} Validation result
   */
  static validateTemplate(template) {
    if (!template || typeof template !== "string") {
      return { valid: false, error: "Template must be a non-empty string" };
    }

    // Check for valid parameter syntax
    const validParams = Object.values(this.PARAMETERS);
    const paramRegex = /<[^>]+>/g;
    const foundParams = template.match(paramRegex) || [];

    const invalidParams = foundParams.filter(
      (param) => !validParams.includes(param)
    );
    if (invalidParams.length > 0) {
      return {
        valid: false,
        error: `Invalid parameters: ${invalidParams.join(", ")}`,
      };
    }

    return { valid: true };
  }
}

/**
 * Export format factory for creating processor instances
 */
export class ExportFormatFactory {
  /**
   * Creates a new format processor instance
   * @returns {ExportFormatProcessor} New processor instance
   */
  static create() {
    return new ExportFormatProcessor();
  }

  /**
   * Creates a processor with predefined options
   * @param {Object} options - Processing options
   * @returns {Object} Processor with bound options
   */
  static createWithOptions(options = {}) {
    return {
      process: (template, tabs) =>
        ExportFormatProcessor.process(template, tabs, options),
      validate: (template) => ExportFormatProcessor.validateTemplate(template),
      getParameters: () => ExportFormatProcessor.getAvailableParameters(),
      getExamples: () => ExportFormatProcessor.getExamples(),
    };
  }
}
