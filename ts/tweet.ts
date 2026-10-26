class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
       
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        //Live events invite people to watch in real time, e.g. "Watch my run right now with @Runkeeper Live ... #RKLive"
        if (this.text.startsWith("Watch my") || this.text.includes("#RKLive")) {
            return "live_event";
        }
        //Achievements are personal records or newly set goals
        if (this.text.startsWith("Achieved") || this.text.startsWith("I just set a goal")) {
            return "achievement";
        }
        //Everything else is general RunKeeper-related discussion
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        // Only completed events can have user text. RunKeeper's default text says "Check it out!"; when the user wrote something, it replaces that with " - " followed by their words
        return this.source == "completed_event" && this.text.includes(" - ");
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        // Strip the t.co link and the hashtag, then keep everything after the first " - "
        const cleaned = this.text.replace(/https:\/\/t\.co\/\w+/g, "").replace("#Runkeeper", "");
        return cleaned.substring(cleaned.indexOf(" - ") + 3).trim();
    }

    private get hasDistance():boolean {
        //split the tweet into a list of words
        const words = this.text.split(" ");
        const unit = words[4];
        return !isNaN(parseFloat(words[3])) && (unit == "km" || unit == "mi");
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //split the tweet into a list of words
        const words = this.text.split(" ");

        //the activity name starts at word 5 if there is a distance, otherwise at word 3
        const start = this.hasDistance ? 5 : 3;
        //the words that make up the activity name
        const activityWords:string[] = [];

        //add words to the name until we reach a word that ends it
        for (let i = start; i < words.length; i++) {
            const word = words[i];
            const isTimeMarker = !this.hasDistance && word == "in";
            if (word == "with" || word == "-" || isTimeMarker || word.startsWith("https")) {
                break;
            }
            activityWords.push(word);
        }

        //no words found, so we don't know the activity
        if (activityWords.length == 0) {
            return "unknown";
        }
        //join the words back into one name
        return activityWords.join(" ");
    }

    get distance():number {
        //only completed tweets with a distance have one, otherwise it is 0
        if(this.source != 'completed_event' || !this.hasDistance) {
            return 0;
        }
        const words = this.text.split(" ");
        //turn the number text into a real number
        const value = parseFloat(words[3]);

        //Convert kilometers to miles so all distances use one unit
        if (words[4] == "km") {
            return value / 1.609;
        }
        return value;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}