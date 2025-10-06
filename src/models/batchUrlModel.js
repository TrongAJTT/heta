/**
 * Batch URL Model helpers
 */

export const createBatchUrlState = ({
  urlPattern = "",
  startId = "",
  endId = "",
  generatedUrls = [],
  batchSize = 8,
  currentOpenIndex = 0,
} = {}) => ({
  urlPattern,
  startId,
  endId,
  generatedUrls,
  batchSize,
  currentOpenIndex,
});

export const normalizeBatchUrlState = (state) => {
  const s = state || {};
  return createBatchUrlState({
    urlPattern: s.urlPattern || "",
    startId: s.startId || "",
    endId: s.endId || "",
    generatedUrls: Array.isArray(s.generatedUrls) ? s.generatedUrls : [],
    batchSize: Number.isFinite(s.batchSize) ? s.batchSize : 8,
    currentOpenIndex: Number.isFinite(s.currentOpenIndex)
      ? s.currentOpenIndex
      : 0,
  });
};

export default {
  createBatchUrlState,
  normalizeBatchUrlState,
};
