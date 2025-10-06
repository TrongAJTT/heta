import { getAllProfiles, saveProfile } from "./storage";

const triggerDownload = (data, filename) => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(data, null, 2));
  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const ensureUniqueId = (desiredId, existingIds) => {
  if (!desiredId || existingIds.has(desiredId)) {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  return desiredId;
};

const ensureUniqueName = (desiredName, existingNames) => {
  const base = (desiredName || "Imported profile").trim() || "Imported profile";
  let candidate = base;
  let suffix = 0;
  while (existingNames.has(candidate.toLowerCase())) {
    suffix += 1;
    candidate = `${base} (${suffix})`;
  }
  return candidate;
};

export const normalizeImportedProfile = (raw, existingProfiles) => {
  const base = typeof raw === "object" && raw !== null ? raw : {};
  const ids = new Set(existingProfiles.map((p) => p.id));
  const names = new Set(
    existingProfiles.map((p) => (p.name || "").toLowerCase())
  );
  const id = ensureUniqueId(base.id, ids);
  const name = ensureUniqueName(base.name, names);
  const modifiedAt = base.modifiedAt || new Date().toISOString();
  const data = base.data && typeof base.data === "object" ? base.data : {};
  return { id, name, modifiedAt, data };
};

export const importProfilesFromJsonText = async (jsonText) => {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    throw new Error("Invalid JSON file");
  }
  const allExisting = await getAllProfiles();
  const items = Array.isArray(parsed) ? parsed : [parsed];
  let count = 0;
  for (const item of items) {
    const normalized = normalizeImportedProfile(item, [...allExisting]);
    const ok = await saveProfile(normalized);
    if (ok) {
      allExisting.push(normalized);
      count += 1;
    }
  }
  return count;
};

/**
 * Clean profile data before export
 * Removes redundant fields that are already in nested structures
 * @param {object} data - Profile data
 * @returns {object} Cleaned data
 */
const cleanProfileData = (data) => {
  if (!data || typeof data !== "object") return {};

  const cleaned = { ...data };

  // Remove redundant batch URL fields (they're already in batchUrl object)
  delete cleaned.batchSize;
  delete cleaned.generatedUrls;
  delete cleaned.startId;
  delete cleaned.endId;
  delete cleaned.urlPattern;
  delete cleaned.currentOpenIndex;

  return cleaned;
};

export { cleanProfileData };

export const exportAllProfilesToFile = async (filename = "profiles.json") => {
  const profiles = await getAllProfiles();
  const normalized = profiles.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    modifiedAt: p.modifiedAt,
    data: cleanProfileData(p.data),
  }));
  triggerDownload(normalized, filename);
  return normalized.length;
};

export default {
  normalizeImportedProfile,
  importProfilesFromJsonText,
  exportAllProfilesToFile,
  cleanProfileData,
};
