console.log(document.getElementsByTagName("RATING"));

function removeRatingTagContent(){
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
}

function removeRatingFromUserLink(){
	var elements = document.getElementsByClassName("user-link");
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++){
		var element = elements[elementIndex];
		var elementText = element.innerHTML;
		var newText = elementText.split(" (")[0];
		element.innerHTML = newText;
	}
}

function removeRatingFromUserMouseover(){
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
}

function removeRatings(){
	//removeRatingTagContent();
	//removeRatingClassContent();
	removeRatingFromUserLink();
	//removeRatingFromUserMouseover();
}

function addUserLinkEventListeners(){
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
}

//https://www.rainbodesign.com/pub/css/css-javascript.html
function removeStylesheet(theHref) {
	var sheets = document.styleSheets;
	for (i=0; i<sheets.length; i++) {
		console.log(sheets[i].href);
		if (sheets[i].href == theHref) {
			sheets[i].disabled = true;
		} // endif sheets[i].href
	} // end for i
} // end removeStylesheet()

function addStylesheet(theHref) {
	if(document.createStyleSheet) {
		document.createStyleSheet(theHref);
	} else {
		var newSheet = document.createElement('link');
		newSheet.setAttribute('rel','stylesheet');
		newSheet.setAttribute('type','text/css');
		newSheet.setAttribute('href', theHref);
		document.getElementsByTagName('head')[0].appendChild(newSheet);
	}
} // end addStylesheet()

window.onload = () => {
	//removeRatings();
	removeStylesheet("styleb.css");
	//addUserLinkEventListeners();
}