document.addEventListener("DOMContentLoaded", async () => {
  const toggle = document.getElementById("blockShortsToggle");

  // Load the current toggle state from storage
  chrome.storage.sync.get(["blockShortsEnabled"], (result) => {
    toggle.checked = result.blockShortsEnabled ?? true; // Default to enabled
  });

  // Listen for toggle changes
  toggle.addEventListener("change", () => {
    const isEnabled = toggle.checked;

    // Save the updated toggle state
    chrome.storage.sync.set({blockShortsEnabled: isEnabled});

    // Send a message to content.js to enable/disable blocking
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {blockShortsEnabled: isEnabled});
    });
  });
});
