const handleNavigation = () => {
  const currentUrl = window.location.href;
  console.log("Current URL is:", currentUrl);

  // Redirect if YouTube Shorts or Facebook Reels detected
  if (
    currentUrl.includes("youtube.com/shorts") ||
    currentUrl.includes("facebook.com/reel")
  ) {
    window.location.href = "https://github.com/scottsoif/block-shorts";
  }
};

chrome.storage.sync.get(["blockShortsEnabled"], (result) => {
  if (chrome.runtime.lastError) {
    console.error("Error accessing storage:", chrome.runtime.lastError);
  } else {
    const blockShortsEnabled = result.blockShortsEnabled ?? true; // Default to true if not set
    if (blockShortsEnabled) {
      const currentUrl = window.location.href;
      handleNavigation();
      // Backup URL check every 5 seconds (set only once)
      if (currentUrl.includes("facebook.com")) {
        setInterval(handleNavigation, 3000);
      } else if (currentUrl.includes("youtube.com")) {
        setInterval(handleNavigation, 5000);
      }
    }
  }
});

// Detect browser navigation events
window.addEventListener("popstate", handleNavigation);

// Detect pushState or replaceState changes (common in SPAs)
(function (history) {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function () {
    const result = pushState.apply(history, arguments);
    window.dispatchEvent(new Event("pushstate"));
    return result;
  };

  history.replaceState = function () {
    const result = replaceState.apply(history, arguments);
    window.dispatchEvent(new Event("replacestate"));
    return result;
  };
})(window.history);

window.addEventListener("pushstate", handleNavigation);
window.addEventListener("replacestate", handleNavigation);

// Listen for messages from popup.js and toggle blocking
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.blockShortsEnabled !== undefined) {
    console.log("Block Shorts enabled:", request.blockShortsEnabled);

    // Update storage with new state
    chrome.storage.sync.set(
      {blockShortsEnabled: request.blockShortsEnabled},
      () => {
        if (chrome.runtime.lastError) {
          console.error("Error setting storage:", chrome.runtime.lastError);
        } else {
          console.log(
            "Storage updated, blockShortsEnabled:",
            request.blockShortsEnabled
          );
          // Handle enabling/disabling blocking logic here if needed
          if (request.blockShortsEnabled) {
            handleNavigation(); // Trigger navigation logic if enabled
          }
        }
      }
    );
  }
});
