chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ adblockEnabled: true });
});
chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.local.get("adblockEnabled", (data) => {
    if (!data.adblockEnabled) return;

    // Close suspicious popup tabs
    if (tab.pendingUrl && (
      tab.pendingUrl.includes("ad") ||
      tab.pendingUrl.includes("track") ||
      tab.pendingUrl.includes("click")
    )) {
      chrome.tabs.remove(tab.id);
    }
  });
});

chrome.storage.onChanged.addListener((changes) => {
  if (!changes.adblockEnabled) return;

  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: changes.adblockEnabled.newValue
      ? ["ruleset_1"]
      : [],
    disableRulesetIds: changes.adblockEnabled.newValue
      ? []
      : ["ruleset_1"]
  });
});
