var startIndex;

document.addEventListener('DOMContentLoaded', function() {
	updateIndexButton();
	
	//Add click listender to start index button
	document.getElementById('startButton').addEventListener('click', function() {
		//Get active tab, on current id
		chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
			chrome.storage.local.get("startIndex", function(val) {
				if (val["startIndex"] == -1) chrome.storage.local.set({startIndex: tabs[0].index}); //Set starting index
				else {
					startIndex = val["startIndex"];
					
					var IDs = new Map();
					for (i = val["startIndex"]; i <= tabs[0].index; i++) {
						chrome.tabs.query({'index': i}, function(tab) {
							$.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + tab[0].url.match('(?<=\\?v=)(.*)(?=&)')[0] + '&part=contentDetails&key=AIzaSyAkm5fqc8zGmhNE9u61RJx0--hWjUdIEIk', function(data, status, xhr) {
								IDs.set("" + tab[0].id, convertTimeToSec(data["items"][0]["contentDetails"]["duration"]) + ":" + data["items"][0]["contentDetails"]["duration"]);
								
								if (tab[0].index == tabs[0].index) sortAndMove(IDs);
							});
						});
					}
					
					chrome.storage.local.set({startIndex: -1});
				}
				
				//Update button text to current situtation
				updateIndexButton();
			});
		});
	});
});

function convertTimeToSec(time) {
	time = time.substring(2);
	
	var secs = 0;
	
	while (time.length > 0) {
		var match = time.match('\\d*.')[0];
		switch (match.charAt(match.length-1)) {
			case 'D':
				secs += +match.substring(0, match.length-1) * 24 * 60 * 60;
			break;
			case 'H':
				secs += +match.substring(0, match.length-1) * 60 * 60;
			break;
			case 'M':
				secs += +match.substring(0, match.length-1) * 60;
			break;
			case 'S':
				secs += +match.substring(0, match.length-1);
			break;
		}
		
		time = time.substring(match.length+1);
	}
	
	return secs;
}

function sortAndMove(list) {
	var sorted = new Map([...list.entries()].sort((a, b) => b[1].split(":")[0] - a[1].split(":")[0]));
	
	console.log(sorted);
	
	var keys = [...sorted.keys()];
	var keysInt = [];
	for (var i = 0; i < keys.length; i++) keysInt[i] = +keys[i];
	
	console.log(keysInt);
	
	chrome.tabs.move(keysInt, {index: parseInt(startIndex)});
}

function updateIndexButton() {
	chrome.storage.local.get("startIndex", function(val) {
		if (val["startIndex"] == -1) document.getElementById('startButton').innerHTML = "Start";
		else document.getElementById('startButton').innerHTML = "End";
	});
}