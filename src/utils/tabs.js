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
    { id: 4, title: "Google", url: "https://google.com" },
    { id: 5, title: "YouTube", url: "https://youtube.com" },
    { id: 6, title: "Twitter", url: "https://twitter.com" },
    { id: 7, title: "Facebook", url: "https://facebook.com" },
    { id: 8, title: "Instagram", url: "https://instagram.com" },
    { id: 9, title: "LinkedIn", url: "https://linkedin.com" },
    { id: 10, title: "Reddit", url: "https://reddit.com" },
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
