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

	//Chart 1 data: one plain object per completed tweet, Vega-Lite counts them
	let activityData = [];
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == 'completed_event') {
			activityData.push({activityType: tweet_array[i].activityType});
		}
	}

	//Charts 2 and 3 data: the names of the 3 most tweeted activities
	let topThree = [sortedActivities[0][0], sortedActivities[1][0], sortedActivities[2][0]];

	//One plain object per completed tweet of a top 3 activity, with its distance and time
	let topThreeData = [];
	for (let i = 0; i < tweet_array.length; i++) {
		let tweet = tweet_array[i];
		if (tweet.source == 'completed_event' && topThree.includes(tweet.activityType)) {
			topThreeData.push({
				activityType: tweet.activityType,
				distance: tweet.distance,
				time: tweet.time
			});
		}
	}

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  //One bar per activity type, as tall as the number of tweets, sorted from most to least
	  "mark": "bar",
	  "encoding": {
	    "x": {"field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity type"},
	    "y": {"aggregate": "count", "type": "quantitative", "title": "Number of tweets"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//Chart 2: every top 3 activity as a point, by day of the week (Sun to Sat)
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distances of the three most tweeted activities by day of the week.",
	  "data": {
	    "values": topThreeData
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "time", "timeUnit": "day", "type": "ordinal", "title": "Day of the week"},
	    "y": {"field": "distance", "type": "quantitative", "title": "Distance (mi)"},
	    "color": {"field": "activityType", "type": "nominal", "title": "Activity type"}
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	//Chart 3: same as chart 2, but the y axis shows the mean distance for each day
	distance_mean_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distances of the three most tweeted activities by day of the week.",
	  "data": {
	    "values": topThreeData
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "time", "timeUnit": "day", "type": "ordinal", "title": "Day of the week"},
	    "y": {"field": "distance", "aggregate": "mean", "type": "quantitative", "title": "Mean distance (mi)"},
	    "color": {"field": "activityType", "type": "nominal", "title": "Activity type"}
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_mean_vis_spec, {actions:false});

	//Start with the means chart hidden
	let allChart = document.getElementById('distanceVis');
	let meanChart = document.getElementById('distanceVisAggregated');
	let toggleButton = document.getElementById('aggregate');
	meanChart.style.display = 'none';

	//Each click swaps which chart is shown and changes the button text
	toggleButton.addEventListener('click', function() {
		if (meanChart.style.display == 'none') {
			meanChart.style.display = '';
			allChart.style.display = 'none';
			toggleButton.innerText = 'Show all activities';
		} else {
			meanChart.style.display = 'none';
			allChart.style.display = '';
			toggleButton.innerText = 'Show means';
		}
	});

	//Answers read from the means chart (the one place typing values in is allowed)
	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});