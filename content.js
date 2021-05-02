/*
 * author: Ethan Lebowitz
 */
 
/*
 * Removes the rating from the user links at the top left of the screen during games
 */
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

/*
 * Removes rating changes from the puzzle session boxes under the board while playing puzzles.
 */
function removePuzzleSessionRatingChanges(){
	var puzzlesSucceeded = document.getElementsByClassName("result-true");
	var puzzlesFailed = document.getElementsByClassName("result-false");
	for(var i=0; i<puzzlesSucceeded.length; i++){
		var box = puzzlesSucceeded[i];
		box.innerHTML = "";
	}
	for(var i=0; i<puzzlesFailed.length; i++){
		var box = puzzlesFailed[i];
		box.innerHTML = "";
	}
}

/*
 * Removes ratings from the champions list on the left of lichess tv.
 */
function removeChampionRatings(){
	var championElements = document.getElementsByClassName("champion");
	for(var i=0; i<championElements.length; i++){
		var champion = championElements[i];
		champion.innerHTML = champion.innerHTML.split(" ")[0];
	}
}

/*
 * Removes ratings from the leaderboards.
 */
function removeLeaderboardRatings(){
	//remove ratings from online players sidebar on leaderboard page
	var textElements = document.getElementsByClassName("text");
	for(var i=0; i<textElements.length; i++){
		var element = textElements[i];
		if(element.title.includes("rating over")){
			element.innerHTML = "";
		}
	}
	
	//remove ratings from leaderboards
	var leaderboards = document.getElementsByClassName("leaderboards");
	if(leaderboards.length == 0){return;}
	var leaderboardElement = leaderboards[0];
	//get all list items that are under the leaderboards div
	var listElements = leaderboardElement.querySelectorAll("li");
	for(var i=0; i<listElements.length; i++){
		var listElement = listElements[i];
		listElement.innerHTML = listElement.innerHTML.substring(0,listElement.innerHTML.indexOf("</a>")+4);
	}
}

/*
 * Calls functions to initially remove ratings when the page is loaded
 */
function removeRatings(){
	console.log("removing ratings");
	removeRatingFromUserLink();
	removeRatingsFromPastGames();
	removePuzzleRatings();
	removePuzzleSessionRatingChanges();
	removeLeaderboardRatings();
	removeChampionRatings();
}

/*
 * When a game ends the user links at the top left are reloaded and so regain their ratings.
 * To solve this add a mutation observer to a parent element so we can remove the ratings again
 * when they reload.
 */
function addUserLinkMutationObserver(){
	
	const config = { childList: true };
	
	const callback = function(mutationsList, observer) {
		removeRatingFromUserLink();
		observer.disconnect();
	};
	
	addMutationObserver("round__side", callback, config);
}

/*
 * Reloads page when the user toggles hidden ratings (by clicking the extension icon).
 */
function reloadPage(){
	window.location.reload();
}

/*
 * Watches for the "toggleRatings" message which is sent when the user clicks the extension icon.
 * Don't need to do anything but reload the page because when the page loads we retrieve the
 * hideRatings setting from memory.
 */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.command == "toggleRatings"){
			reloadPage();
			sendResponse({confirm: "OK"});
		}
	}
);

var hidingRatings;
/*
 * Gets the "hideRatings" setting from memory. Returns a promise which resolves to true or false.
 */
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

/*
 * Removes ratings from the list of past games in a users profile.
 */
function removeRatingsFromPastGames() {
	var players = document.getElementsByClassName("player");
	
	for(var i=0; i<players.length; i++){
		var element = players[i];
		element.innerHTML = element.innerHTML.split("<br>")[0];
	}
}

/*
 * Removes ratings from puzzles.
 */
function removePuzzleRatings() {
	var infos = document.getElementsByClassName("puzzle infos");
	if (infos.length == 0){return;}
	var element = infos[0];
	
	var splitInnerHTML = element.innerHTML.split("<p>Rating");
	console.log(splitInnerHTML);
	element.innerHTML = splitInnerHTML[0] + splitInnerHTML[1].substring(splitInnerHTML[1].indexOf("</p>")+4);
}

/*
 * Adds a mutation observer to className.
 */
function addMutationObserver(className, callback, config){
	var elements = document.getElementsByClassName(className);
	if(elements.length == 0){return;}
	var element = elements[0];
	
	//https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
	const targetNode = element;
	
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, config);
}

/*
 * Adds mutation observer to "angle-content" in user profile. When user switches from activity tab
 * to Games tab a new page is not loaded so removeRatingsFromPastGames() will not trigger. The child
 * list of "angle-content" does change so we can use a mutation observer to solve this.
 */
function addAngleContentMutationObserver(){
	const config = { childList: true };
	
	const callback = function(mutationsList, observer) {
		removeRatingsFromPastGames();
		//add a games observer to detect scrolling
		addGamesMutationObserver();
	};
	
	addMutationObserver("angle-content", callback, config);
}

/*
 * Detect when user scrolls to reveal new games in the Games tab of the user profile so we
 * can hide the ratings.
 */
function addGamesMutationObserver(){
	const config = { childList: true };
	
	const callback = function(mutationsList, observer) {
		removeRatingsFromPastGames();
	};
	
	addMutationObserver("games", callback, config);
}

/*
 * On window load retrieve the "hideRatings" setting from storage. Then hide the ratings 
 * or not based on the setting. 
 * 
 * Elements that include ratings that must be dynamically removed
 * are hidden by default in our extension stylesheet. We then toggle the "<element>Shown" class
 * on the body to reveal them once the ratings have been removed (or if we don't have to remove
 * the ratings). This prevents the ratings from flashing before javascript can remove them.
 * This solution came from:
 * //https://stackoverflow.com/questions/38003840/how-to-toggle-css-style-in-google-chrome-extensionmanifest
 */
window.onload = () => {
	getHidingRatings().then(value => {
		if(value){
			removeRatings(value);
			addUserLinkMutationObserver();
			
			//for removing ratings from past games in user profile
			addAngleContentMutationObserver(); 
			addGamesMutationObserver();
			
			//add this to prevent a flicker of the ratings from getting through before they can
			//be removed by javascript.
			document.body.classList.toggle('dynamicContentShown');
		}
		else{
			document.body.classList.toggle('dynamicContentShown');
		}
		console.log(value);
		hidingRatings = value;
	});
}