function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//Count tweets per activity type, completed events only
	let counts = {};
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == 'completed_event') {
			let type = tweet_array[i].activityType;
			counts[type] = (counts[type] || 0) + 1;
		}
	}

	//Sort the activity types from most to least tweeted
	let sortedActivities = Object.entries(counts).sort(function(a, b) {
		return b[1] - a[1];
	});

	//Show the number of activity types and the top 3 on the page
	document.getElementById('numberActivities').innerText = sortedActivities.length;
	document.getElementById('firstMost').innerText = sortedActivities[0][0];
	document.getElementById('secondMost').innerText = sortedActivities[1][0];
	document.getElementById('thirdMost').innerText = sortedActivities[2][0];

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});