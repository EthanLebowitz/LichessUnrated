document.getElementById("ratingsButton").addEventListener("click", toggleRatings);

function toggleRatings(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {command: "toggleRatings"}, function(response) {
			//console.log(response.confirm);
		});
	});
}