
function removeRatingFromUserLink(){
	console.log("remove user link ratings");
	var elements = document.getElementsByClassName("user-link");
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++){
		var element = elements[elementIndex];
		var elementText = element.innerHTML;
		if(elementText.includes(" (")){
			var newText = elementText.split(" (")[0];
			element.innerHTML = newText;
		}
	}
}

function removeRatings(){
	console.log("removing ratings");
	removeRatingFromUserLink();
	removeRatingsFromPastGames();
}

function addUserLinkMutationObserver(){
	
	var elements = document.getElementsByClassName("round__side");
	if(elements.length == 0){return;}
	var element = elements[0];
	console.log(element);
	
	//https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
	const targetNode = element;
	const config = { childList: true };
	
	const callback = function(mutationsList, observer) {
		removeRatingFromUserLink();
		observer.disconnect();
	};
	
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, config);
}

function toggleRatings(){
	console.log(hidingRatings);
	window.location.reload();
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.command == "toggleRatings"){
			toggleRatings();
			sendResponse({confirm: "OK"});
		}
	}
);

var hidingRatings;
function getHidingRatings(){
	return new Promise(function(resolve, reject) {
		chrome.storage.local.get(['hideRatings'], function(result) {
			if(result.hideRatings == null){
				resolve(true);
			}
			resolve(result.hideRatings);
		});
	});
}

function removeRatingsFromPastGames() {
	var players = document.getElementsByClassName("player");
	
	for(var i=0; i<players.length; i++){
		var element = players[i];
		element.innerHTML = element.innerHTML.split("<br>")[0];
	}
}

function addGamesMutationObserver(){
	var elements = document.getElementsByClassName("games");
	if(elements.length > 0){
		element = elements[0];
		const targetNode = element;
		const config = { childList: true };
		
		const callback = function(mutationsList, observer) {
			console.log("games!");
			removeRatingsFromPastGames();
			addGamesMutationObserver();
		};
		
		const observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
	}
}

function addAngleContentMutationObserver(){
	var elements = document.getElementsByClassName("angle-content");
	if(elements.length > 0){
		element = elements[0];
		const targetNode = element;
		const config = { childList: true };
		
		const callback = function(mutationsList, observer) {
			console.log("games!");
			removeRatingsFromPastGames();
			addGamesMutationObserver();
		};
		
		const observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
	}
}

//https://stackoverflow.com/questions/38003840/how-to-toggle-css-style-in-google-chrome-extensionmanifest
document.body.classList.toggle('ratingsHidden');

window.onload = () => {
	getHidingRatings().then(value => {
		if(value){
			removeRatings(value);
			addUserLinkMutationObserver();
			
			//for removing ratings from past games in user profile
			addAngleContentMutationObserver(); 
			addGamesMutationObserver();
		}
		else{
			document.body.classList.toggle('ratingsHidden');
		}
		hidingRatings = value;
	});
}