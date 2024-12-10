// Listen for the command to log "Hello World"
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle_viewed_files") {
    // Send a message to the content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggleViewedFiles"});
      }
    });
  }
});
