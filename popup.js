const toggle = document.getElementById("toggle");
const statusText = document.getElementById("statusText");

chrome.storage.local.get("adblockEnabled", (data) => {
  toggle.checked = data.adblockEnabled;
  updateText(data.adblockEnabled);
});

toggle.addEventListener("change", () => {
  chrome.storage.local.set({
    adblockEnabled: toggle.checked
  });
  updateText(toggle.checked);
});

function updateText(enabled) {
  statusText.textContent = enabled
    ? "🟢 Ad Blocker is ON"
    : "🔴 Ad Blocker is OFF";
}
