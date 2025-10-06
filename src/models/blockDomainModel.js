/**
 * Blocked Domain Model
 */

export const createBlockedDomain = ({ id, domain, modifiedAt } = {}) => ({
  id: id || Date.now().toString(),
  domain: (domain || "").trim(),
  modifiedAt: modifiedAt || new Date().toISOString(),
});

export const normalizeBlockedDomains = (items) => {
  const list = Array.isArray(items) ? items : [];
  return list
    .filter((d) => typeof d === "object" && d)
    .map((d) =>
      createBlockedDomain({
        id: d.id,
        domain: d.domain,
        modifiedAt: d.modifiedAt,
      })
    );
};

export default {
  createBlockedDomain,
  normalizeBlockedDomains,
};
