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
	var elements = document.getElementsByClassName("user-link");
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++){
		var element = elements[elementIndex];
		var elementText = element.innerHTML;
		var newText = elementText.split(" (")[0];
		element.innerHTML = newText;
	}
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

/* function addUserLinkEventListeners(){
	var userLinks = document.getElementsByClassName("text");
	for(var linkIndex=0; linkIndex < userLinks.length; linkIndex++){
		var element = userLinks[linkIndex];
		if(element.id != "reconnecting"){
			element.onmouseover = function(){
				console.log(1);
				removeRatingFromUserMouseover();
			}
		}
	}
	console.log(userLinks);
} */

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

//https://stackoverflow.com/questions/38003840/how-to-toggle-css-style-in-google-chrome-extensionmanifest
document.body.classList.toggle('ratingsHidden');

window.onload = () => {
	getHidingRatings().then(value => {
		if(value){removeRatings(value);}
		else{document.body.classList.toggle('ratingsHidden');}
		hidingRatings = value;
	});
}