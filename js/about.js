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

	//Find the earliest and latest tweet dates
	for(let i = 1; i < tweet_array.length; i++){
		if(tweet_array[i].time < earliest.time){
			earliest = tweet_array[i];
		}
		if(tweet_array[i].time > latest.time){
			latest = tweet_array[i];
		}
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
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});