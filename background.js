

// chrome.runtime.onInstalled.addListener(function() {
//   console.log("123");
// });


chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'chrome://newtab' });
});

