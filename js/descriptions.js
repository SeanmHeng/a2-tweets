//The tweets with user-written text, filled in by parseTweets and searched by the search box
let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//Keep only the tweets where the user wrote something
	writtenTweets = tweet_array.filter(function(tweet) {
		return tweet.written;
	});
}

function addEventHandlerForSearch() {
	let searchBox = document.getElementById('textFilter');
	let searchCount = document.getElementById('searchCount');
	let searchText = document.getElementById('searchText');
	let tweetTable = document.getElementById('tweetTable');

	//Start with an empty search
	searchCount.innerText = 0;
	searchText.innerText = '';

	//The input event fires every time a character is typed or deleted
	searchBox.addEventListener('input', function(event) {
		let query = event.target.value;
		searchText.innerText = query;

		//An empty search shows no tweets
		if (query == '') {
			searchCount.innerText = 0;
			tweetTable.innerHTML = '';
			return;
		}

		//Find the tweets whose written text contains the search (ignoring upper/lower case)
		let matches = writtenTweets.filter(function(tweet) {
			return tweet.writtenText.toLowerCase().includes(query.toLowerCase());
		});
		searchCount.innerText = matches.length;

		//Build all the rows as one string, then put them in the table once
		let rows = '';
		for (let i = 0; i < matches.length; i++) {
			rows += matches[i].getHTMLTableRow(i + 1);
		}
		tweetTable.innerHTML = rows;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});