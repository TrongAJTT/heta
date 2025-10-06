/**
 * Domain validation service following SOLID principles
 *
 * Single Responsibility: Each method has one clear responsibility
 * Open/Closed: Can be extended without modifying existing code
 * Liskov Substitution: Can be replaced with other validation implementations
 * Interface Segregation: Clean, focused interface
 * Dependency Inversion: Depends on abstractions, not concrete implementations
 */

export class DomainValidator {
  /**
   * Validates domain format requirements
   * @param {string} domain - Domain to validate
   * @returns {Object} Validation result with valid boolean and error message
   */
  static validateFormat(domain) {
    const trimmed = domain.trim();
    if (!trimmed) {
      return { valid: false, error: "Domain cannot be empty" };
    }

    // Check minimum requirement: at least 2 parts separated by dots
    const parts = trimmed.split(".");
    if (parts.length < 2) {
      return {
        valid: false,
        error: "Domain must have at least 2 parts (e.g., example.com)",
      };
    }

    // Check for empty parts
    if (parts.some((part) => !part)) {
      return { valid: false, error: "Domain cannot have empty parts" };
    }

    // Enhanced domain format validation
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(trimmed)) {
      return { valid: false, error: "Invalid domain format" };
    }

    return { valid: true, domain: trimmed };
  }

  /**
   * Validates domain uniqueness against existing domains
   * @param {string} domain - Domain to check
   * @param {Array} blockedDomains - Array of existing blocked domains
   * @param {string|null} editingId - ID of domain being edited (to exclude from check)
   * @returns {Object} Validation result with valid boolean and error message
   */
  static validateUniqueness(domain, blockedDomains, editingId) {
    const isDuplicate = blockedDomains.some(
      (d) =>
        d.domain.toLowerCase() === domain.toLowerCase() && d.id !== editingId
    );

    if (isDuplicate) {
      return { valid: false, error: "Domain already exists in the list" };
    }

    return { valid: true };
  }

  /**
   * Comprehensive domain validation combining format and uniqueness checks
   * @param {string} domain - Domain to validate
   * @param {Array} blockedDomains - Array of existing blocked domains
   * @param {string|null} editingId - ID of domain being edited
   * @returns {Object} Validation result with valid boolean, domain, and error message
   */
  static validate(domain, blockedDomains, editingId = null) {
    // Format validation
    const formatResult = this.validateFormat(domain);
    if (!formatResult.valid) {
      return formatResult;
    }

    // Uniqueness validation
    const uniquenessResult = this.validateUniqueness(
      formatResult.domain,
      blockedDomains,
      editingId
    );
    if (!uniquenessResult.valid) {
      return uniquenessResult;
    }

    return { valid: true, domain: formatResult.domain };
  }
}

/**
 * Domain validation factory for creating validator instances
 * Follows Factory pattern for better testability and extensibility
 */
export class DomainValidatorFactory {
  /**
   * Creates a new domain validator instance
   * @returns {DomainValidator} New validator instance
   */
  static create() {
    return new DomainValidator();
  }

  /**
   * Creates a validator with predefined blocked domains
   * @param {Array} blockedDomains - Predefined list of blocked domains
   * @returns {Object} Validator with bound context
   */
  static createWithContext(blockedDomains) {
    return {
      validate: (domain, editingId = null) =>
        DomainValidator.validate(domain, blockedDomains, editingId),
      validateFormat: (domain) => DomainValidator.validateFormat(domain),
      validateUniqueness: (domain, editingId = null) =>
        DomainValidator.validateUniqueness(domain, blockedDomains, editingId),
    };
  }
}

/**
 * Domain validation constants
 */
export const DOMAIN_VALIDATION_RULES = {
  MIN_PARTS: 2,
  MAX_LENGTH: 253,
  MAX_PART_LENGTH: 63,
  ALLOWED_CHARS: /^[a-zA-Z0-9.-]+$/,
  FORMAT_REGEX:
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
};

/**
 * Domain validation error messages
 */
export const DOMAIN_VALIDATION_MESSAGES = {
  EMPTY: "Domain cannot be empty",
  MIN_PARTS: "Domain must have at least 2 parts (e.g., example.com)",
  EMPTY_PARTS: "Domain cannot have empty parts",
  INVALID_FORMAT: "Invalid domain format",
  DUPLICATE: "Domain already exists in the list",
  TOO_LONG: "Domain is too long",
  INVALID_CHARS: "Domain contains invalid characters",
};
