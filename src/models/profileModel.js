/**
 * Profile Model
 */

export const createProfile = ({
  id,
  name,
  description,
  data,
  modifiedAt,
} = {}) => ({
  id: id || Date.now().toString(),
  name: (name || "").trim(),
  description: description || "",
  data: data && typeof data === "object" ? data : {},
  modifiedAt: modifiedAt || new Date().toISOString(),
});

export const normalizeProfile = (raw) => {
  const base = typeof raw === "object" && raw ? raw : {};
  return createProfile(base);
};

export default {
  createProfile,
  normalizeProfile,
};
