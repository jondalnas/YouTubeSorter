chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				css: ["video"]
			})
			],
				actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
	
	chrome.storage.local.set({startIndex: -1});
});
