
var hidingRatings;
function getHidingRatings(){
	return new Promise(function(resolve, reject) {
		chrome.storage.local.get(['hideRatings'], function(result) {
			if(result.hideRatings == null){
				console.log("not yet set");
				storeSetting(true);
				//hidingRatings = true;
				resolve(true);
			}
			console.log('Value currently is ' + result.hideRatings);
			//hidingRatings = result.key;
			resolve(result.hideRatings);
		});
	});
}
hidingRatings = getHidingRatings();
hidingRatings.then((value) => {toggleIcon(value)});

function storeSetting(hideRatings){
	chrome.storage.local.set({"hideRatings": hideRatings}, function() {
		console.log('Value is set to ' + hideRatings);
	});
}

function toggleIcon(value){
	console.log(value);
	if(!value){
		chrome.browserAction.setIcon({path: 'icons/icon16inactive.png'});
	} else {
		chrome.browserAction.setIcon({path: 'icons/icon16active.png'});
	}
}

function toggleRatings(){
	chrome.tabs.query({}, function(tabs) {
		for (var i=0; i<tabs.length; ++i) {
			chrome.tabs.sendMessage(tabs[i].id, {command: "toggleRatings"});
			hidingRatings = !hidingRatings;
			toggleIcon(hidingRatings);
			storeSetting(hidingRatings);
		}
	});
}

chrome.browserAction.onClicked.addListener(function(tab) { 
	toggleRatings();
});