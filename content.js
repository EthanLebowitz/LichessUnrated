//console.log(document.getElementsByTagName("RATING"));

/* function removeRatingTagContent(){
	var elements = document.getElementsByTagName("RATING");
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++){
		var element = elements[elementIndex];
		element.innerHTML = "";
	}
}

function removeRatingClassContent(){
	var elements = document.getElementsByClassName("rating");
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++){
		var element = elements[elementIndex];
		element.innerHTML = "";
	}
} */

function removeRatingFromUserLink(){
	console.log("remove user link ratings");
	var elements = document.getElementsByClassName("user-link");
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++){
		var element = elements[elementIndex];
		var elementText = element.innerHTML;
		var newText = elementText.split(" (")[0];
		element.innerHTML = newText;
	}
	document.body.classList.toggle('userLinksHidden');
}

/* function removeRatingFromUserMouseover(){
	console.log(2);
	console.log(document.getElementById("powerTip"));
	var elements = document.getElementsByClassName("upt__info__ratings");
	console.log(elements);
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++){
		var children = elements[elementIndex].childNodes;
		console.log(children);
		for(var childIndex = 0; childIndex < children.length; childIndex++){
			var childElement = children[childIndex];
			childElement.innerHTML = "";
			console.log(3);
		}
	}
} */

function removeRatings(){
	console.log("removing ratings");
	//removeRatingTagContent();
	//removeRatingClassContent();
	removeRatingFromUserLink();
	//removeRatingFromUserMouseover();
}

function addUserLinkMutationObserver(){
	
	var elements = document.getElementsByClassName("round__side");
	if(elements.length == 0){return;}
	var element = elements[0];
	console.log(element);
	//https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
	// Select the node that will be observed for mutations
	const targetNode = element;

	// Options for the observer (which mutations to observe)
	const config = { childList: true };

	// Callback function to execute when mutations are observed
	const callback = function(mutationsList, observer) {
		// Use traditional 'for loops' for IE 11
		for(const mutation of mutationsList) {
			removeRatingFromUserLink();
			observer.disconnect();
		}
	};

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
}

function storeSetting(hideRatings){
	chrome.storage.local.set({"hideRatings": hideRatings}, function() {
		console.log('Value is set to ' + hideRatings);
	});
}

function toggleRatings(){
	console.log(hidingRatings);
	storeSetting(!hidingRatings);
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

function shrinkRatingHistoryContainer(){ //not working
	var elements = document.getElementsByClassName("highcharts-container");
	console.log(elements);
	if(elements.length > 0){
		var container = elements[0];
		container.style.width = "0px"
		console.log(container.style.width);
	}
	var elements = document.getElementsByClassName("rating-history");
	console.log(elements);
	if(elements.length > 0){
		var container = elements[0];
		container.style.width = "0px"
		console.log(container.style.width);
	}
}

//https://stackoverflow.com/questions/38003840/how-to-toggle-css-style-in-google-chrome-extensionmanifest
document.body.classList.toggle('ratingsHidden');
document.body.classList.toggle('userLinksHidden');

window.onload = () => {
	getHidingRatings().then(value => {
		if(value){
			removeRatings(value);
			addUserLinkMutationObserver();
			//shrinkRatingHistoryContainer();
		}
		else{
			document.body.classList.toggle('ratingsHidden');
			document.body.classList.toggle('userLinksHidden');
		}
		hidingRatings = value;
	});
}