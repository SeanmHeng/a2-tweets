function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	// sets up variables to store earliest and latest
	let earliest = tweet_array[0];
	let latest = tweet_array[0];

	// sets up variables to store event type
	let counts = {
		completed_event: 0,
		live_event: 0,
		achievement: 0,
		miscellaneous: 0
	};

	// Find the earliest and latest tweet dates
	for(let i = 1; i < tweet_array.length; i++){
		if(tweet_array[i].time < earliest.time){
			earliest = tweet_array[i];
		}
		if(tweet_array[i].time > latest.time){
			latest = tweet_array[i];
		}
	}

	// Decoupled the loops to keep logic readable
	// this classifies the tweets into event types
	for (let i = 0; i < tweet_array.length; i++) {
		counts[tweet_array[i].source]++;
	}
	document.getElementById('firstDate').innerText = earliest.time.toLocaleDateString(
		'en-US', 
		{
		weekday: 'long', 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric'
		});
	document.getElementById('lastDate').innerText = latest.time.toLocaleDateString(
		'en-US', 
		{
			weekday: 'long', 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric'
		});

	//Fills every element with the given class
	function setText(className, value) {
		document.querySelectorAll('.' + className).forEach(function(el) {
			el.innerText = value;
		});
	}

	// Formats a count as a percentage of all tweets with exactly 2 decimals
	function percent(count) {
		return math.format(count / tweet_array.length * 100, {notation: 'fixed', precision: 2}) + '%';
	}

	setText('completedEvents', counts.completed_event);
	setText('completedEventsPct', percent(counts.completed_event));
	setText('liveEvents', counts.live_event);
	setText('liveEventsPct', percent(counts.live_event));
	setText('achievements', counts.achievement);
	setText('achievementsPct', percent(counts.achievement));
	setText('miscellaneous', counts.miscellaneous);
	setText('miscellaneousPct', percent(counts.miscellaneous));

	//Count the completed events that include user-written text (percent is out of completed events, not all tweets)
	let writtenCount = 0;
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].written) {
			writtenCount++;
		}
	}
	setText('written', writtenCount);
	setText('writtenPct', math.format(writtenCount / counts.completed_event * 100, {notation: 'fixed', precision: 2}) + '%');
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});