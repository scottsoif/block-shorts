const blockShorts = () => {
  const shortsSection = document.querySelectorAll('a[href^="/shorts/"]');

  shortsSection.forEach((short) => {
    const parent = short.closest("ytd-grid-video-renderer, ytd-video-renderer");
    if (parent) {
      parent.style.display = "none";
    }
  });
};

// Listen for toggle state changes
chrome.runtime.onMessage.addListener((request) => {
  if (request.blockShortsEnabled) {
    blockShorts();
    const observer = new MutationObserver(blockShorts);
    observer.observe(document.body, {childList: true, subtree: true});
  } else {
    // If disabled, remove Shorts blocking
    const shortsSection = document.querySelectorAll('a[href^="/shorts/"]');
    shortsSection.forEach((short) => {
      const parent = short.closest(
        "ytd-grid-video-renderer, ytd-video-renderer"
      );
      if (parent) {
        parent.style.display = "";
      }
    });
  }
});

// Check if blocking is enabled when the page loads
chrome.storage.sync.get(["blockShortsEnabled"], (result) => {
  if (result.blockShortsEnabled ?? true) {
    blockShorts();
  }
});
