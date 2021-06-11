console.log("123");

chrome.action.onClicked.addListener(() => {
  console.log("123");
  chrome.tabs.create({ url: 'chrome://newtab' });
})