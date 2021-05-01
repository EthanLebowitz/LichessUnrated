
function toggleRatings(){
	chrome.tabs.query({}, function(tabs) {
		for (var i=0; i<tabs.length; ++i) {
			chrome.tabs.sendMessage(tabs[i].id, {command: "toggleRatings"});
		}
	});
}

chrome.browserAction.onClicked.addListener(function(tab) { 
	toggleRatings();
});