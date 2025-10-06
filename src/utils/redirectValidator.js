/**
 * Redirect rule validation service following SOLID principles
 *
 * Single Responsibility: Handles only redirect rule validation
 * Open/Closed: Can be extended with new validation rules
 * Liskov Substitution: Can be replaced with other validators
 * Interface Segregation: Clean, focused interface
 * Dependency Inversion: Depends on abstractions
 */

export class RedirectValidator {
  /**
   * Validates redirect rule format
   * @param {string} fromUrl - Source URL pattern
   * @param {string} toUrl - Target URL
   * @returns {Object} Validation result
   */
  static validateFromUrl(fromUrl) {
    const trimmed = fromUrl.trim();
    if (!trimmed) {
      return { valid: false, error: "Source URL cannot be empty" };
    }

    // Check minimum requirement: at least 2 parts separated by dots
    const parts = trimmed.split(".");
    if (parts.length < 2) {
      return {
        valid: false,
        error: "URL must have at least 2 parts (e.g., example.com)",
      };
    }

    // Check for empty parts
    if (parts.some((part) => !part)) {
      return { valid: false, error: "URL cannot have empty parts" };
    }

    // Enhanced URL pattern validation
    const urlRegex =
      /^[a-zA-Z0-9*]([a-zA-Z0-9*-]{0,61}[a-zA-Z0-9*])?(\.[a-zA-Z0-9*]([a-zA-Z0-9*-]{0,61}[a-zA-Z0-9*])?)*$/;
    if (!urlRegex.test(trimmed)) {
      return { valid: false, error: "Invalid URL pattern format" };
    }

    return { valid: true, url: trimmed };
  }

  /**
   * Validates target URL format
   * @param {string} toUrl - Target URL
   * @returns {Object} Validation result
   */
  static validateToUrl(toUrl) {
    const trimmed = toUrl.trim();
    if (!trimmed) {
      return { valid: false, error: "Target URL cannot be empty" };
    }

    // Check if URL starts with http:// or https://
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      return {
        valid: false,
        error: "Target URL must start with http:// or https://",
      };
    }

    try {
      new URL(trimmed);
      return { valid: true, url: trimmed };
    } catch (e) {
      return { valid: false, error: "Invalid target URL format" };
    }
  }

  /**
   * Validates rule uniqueness
   * @param {string} fromUrl - Source URL
   * @param {Array} redirectRules - Existing rules
   * @param {string|null} editingId - ID being edited
   * @returns {Object} Validation result
   */
  static validateUniqueness(fromUrl, redirectRules, editingId) {
    const isDuplicate = redirectRules.some(
      (r) =>
        r.fromUrl.toLowerCase() === fromUrl.toLowerCase() && r.id !== editingId
    );

    if (isDuplicate) {
      return { valid: false, error: "This redirect rule already exists" };
    }

    return { valid: true };
  }

  /**
   * Comprehensive redirect rule validation
   * @param {string} fromUrl - Source URL
   * @param {string} toUrl - Target URL
   * @param {Array} redirectRules - Existing rules
   * @param {string|null} editingId - ID being edited
   * @returns {Object} Validation result
   */
  static validate(fromUrl, toUrl, redirectRules, editingId = null) {
    // Validate source URL
    const fromResult = this.validateFromUrl(fromUrl);
    if (!fromResult.valid) {
      return fromResult;
    }

    // Validate target URL
    const toResult = this.validateToUrl(toUrl);
    if (!toResult.valid) {
      return toResult;
    }

    // Validate uniqueness
    const uniquenessResult = this.validateUniqueness(
      fromResult.url,
      redirectRules,
      editingId
    );
    if (!uniquenessResult.valid) {
      return uniquenessResult;
    }

    return {
      valid: true,
      fromUrl: fromResult.url,
      toUrl: toResult.url,
    };
  }
}

/**
 * Redirect validator factory
 */
export class RedirectValidatorFactory {
  /**
   * Creates validator with context
   * @param {Array} redirectRules - Existing rules
   * @returns {Object} Validator with bound context
   */
  static createWithContext(redirectRules) {
    return {
      validate: (fromUrl, toUrl, editingId = null) =>
        RedirectValidator.validate(fromUrl, toUrl, redirectRules, editingId),
      validateFromUrl: (fromUrl) => RedirectValidator.validateFromUrl(fromUrl),
      validateToUrl: (toUrl) => RedirectValidator.validateToUrl(toUrl),
      validateUniqueness: (fromUrl, editingId = null) =>
        RedirectValidator.validateUniqueness(fromUrl, redirectRules, editingId),
    };
  }
}
