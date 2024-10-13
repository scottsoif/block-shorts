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

// Immediately run the check when the content script loads
handleNavigation();

// Set an interval to check the URL every 3 seconds
setInterval(handleNavigation, 3000);

// Detect browser navigation events (e.g., back/forward buttons)
window.addEventListener("popstate", handleNavigation);

// Detect pushState or replaceState changes (common in SPAs like React)
(function (history) {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  // Override pushState to detect URL changes
  history.pushState = function () {
    const result = pushState.apply(history, arguments);
    window.dispatchEvent(new Event("pushstate"));
    return result;
  };

  // Override replaceState to detect URL changes
  history.replaceState = function () {
    const result = replaceState.apply(history, arguments);
    window.dispatchEvent(new Event("replacestate"));
    return result;
  };
})(window.history);

// Listen for URL changes triggered by pushState or replaceState
window.addEventListener("pushstate", handleNavigation);
window.addEventListener("replacestate", handleNavigation);

browser.runtime.sendMessage({greeting: "hello"}).then((response) => {
  console.log("Received response22: ", response);
});

// Listen for any runtime messages
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);
  sendResponse({response: "Message received"});
});
