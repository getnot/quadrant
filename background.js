
// fetch("https://bing-image-search1.p.rapidapi.com/images/trending", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-key": "",
// 		"x-rapidapi-host": "bing-image-search1.p.rapidapi.com"
// 	}
// })
// .then(response => {
// 	console.log(response);
// })
// .catch(err => {
// 	console.error(err);
// });

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});