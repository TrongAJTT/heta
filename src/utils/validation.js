/**
 * Common validation utilities
 */

/**
 * Validate profile name
 * @param {string} name - Profile name to validate
 * @param {number} minLength - Minimum length (default: 2)
 * @returns {object} Validation result { isValid, error }
 */
export const validateProfileName = (name, minLength = 2) => {
  const trimmed = (name || "").trim();

  if (!trimmed) {
    return { isValid: false, error: "Please enter a profile name." };
  }

  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `Profile name must be at least ${minLength} characters.`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Check if profile name is duplicate
 * @param {string} name - Profile name to check
 * @param {Array} existingProfiles - Array of existing profiles
 * @param {string} excludeId - Profile ID to exclude from check (for editing)
 * @returns {boolean} True if duplicate
 */
export const isDuplicateProfileName = (
  name,
  existingProfiles,
  excludeId = null
) => {
  const trimmedLower = (name || "").trim().toLowerCase();
  return existingProfiles.some(
    (p) => p.id !== excludeId && p.name.toLowerCase() === trimmedLower
  );
};

export default {
  validateProfileName,
  isDuplicateProfileName,
};
