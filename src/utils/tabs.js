export const queryCurrentWindowHttpTabs = async () => {
  try {
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      return tabs
        .filter((t) => typeof t.url === "string" && /^https?:\/\//i.test(t.url))
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        .map((t) => ({ id: t.id, title: t.title || t.url, url: t.url || "" }));
    }
  } catch (e) {
    console.warn("chrome.tabs.query not available; using fallback.");
  }
  // Fallback for local dev
  return [
    { id: 1, title: "Example 1", url: "https://example.com" },
    { id: 2, title: "GitHub", url: "https://github.com" },
    { id: 3, title: "MDN", url: "https://developer.mozilla.org" },
  ];
};

export const downloadTextFile = (content, filename) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
