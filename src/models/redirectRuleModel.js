/**
 * Redirect Rule Model
 */

export const createRedirectRule = ({
  id,
  fromUrl,
  toUrl,
  modifiedAt,
} = {}) => ({
  id: id || Date.now().toString(),
  fromUrl: (fromUrl || "").trim(),
  toUrl: (toUrl || "").trim(),
  modifiedAt: modifiedAt || new Date().toISOString(),
});

export const normalizeRedirectRules = (rules) => {
  const list = Array.isArray(rules) ? rules : [];
  return list
    .filter((r) => typeof r === "object" && r)
    .map((r) =>
      createRedirectRule({
        id: r.id,
        fromUrl: r.fromUrl,
        toUrl: r.toUrl,
        modifiedAt: r.modifiedAt,
      })
    );
};

export default {
  createRedirectRule,
  normalizeRedirectRules,
};
