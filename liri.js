var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var Request = require('request');
var fs = require('fs');
var arg = process.argv[2];
var arg2 = process.argv[3];

for (i = 4; i < process.argv.length; i++) {
	arg2 += "+" + process.argv[i];
}
function commandSwitch() {
	switch(arg) {
		case "my-tweets":
		getTweets();
		break;
		case "spotify-this-song":
		spotifySong();
		break;
		case "movie-this":
		getMovie();
		break;
		case "do-what-it-says":
		readFile();
		break;
	}
};
function getTweets() {
	console.log("Getting Tweets...");
	var client = new Twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});
	var parameters = {
		screen_name: "LongLivePartyin",
		count: 5
	};
	client.get("statuses/user_timeline", parameters, function(err, tweets, response) {
		if (!err) {
			for (i = 0; i < tweets.length; i++) {
				var data = ("Tweet Number: " + (i + 1) + "\n" + 
					"Date: " + tweets[i].created_at + "\n" + 
					"Content: " + tweets[i].text + "\n");
				console.log("______________________________")
				console.log(data);
			}
		}
		else {
			console.log(err);
		}
	});
};
function spotifySong() {
	console.log("Getting song details...");
	var searchSong;
	var client2 = new Spotify({
		id: keys.spotifyKeys.client_id,
		secret: keys.spotifyKeys.client_secret
	});
	if (arg2 === undefined) {
		searchSong = "Ace of Base";
	}
	else {
		searchSong = arg2;
	}
	client2.search({type:'track', query:searchSong}, function(err, data) {
		if (!err) {
			var data2 = ("Artist: " + data.tracks.items[0].artists[0].name + "\n" + 
				"Song: " + data.tracks.items[0].name + "\n" +
				"Preview Here: " + data.tracks.items[0].preview_url + "\n" +  
				"Album: " + data.tracks.items[0].album.name);
			console.log("______________________________");
			console.log(data2);
			console.log("______________________________");
		}
		else {
			console.log(err);
		}
	});
};
function getMovie() {
	console.log("Getting movie details...");
	var searchMovie;
	if (arg2 === undefined) {
		searchMovie = "Mr. Nobody";
	}
	else {
		searchMovie = arg2;
	}
	var url = "http://www.omdbapi.com/?t= " + searchMovie  + "&y=&plot=long&apikey=40e9cece";
	Request(url, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var data3 = ("Title: " + JSON.parse(body)["Title"] + "\n" +
				"Year: " + JSON.parse(body)["Year"] + "\n" +
				"IMDB Rating: " + JSON.parse(body)["imdbRating"] + "\n" +
				"Country: " + JSON.parse(body)["Country"] + "\n" +
				"Language: " + JSON.parse(body)["Language"] + "\n" +
				"Plot: " + JSON.parse(body)["Plot"] + "\n" +
				"Actors: " + JSON.parse(body)["Actors"] + "\n" +
				"Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]); 
			console.log("______________________________");
			console.log(data3);
			console.log("______________________________");
		}
		else {
			console.log(err);
			console.log(response.statusCode);
		}
	});
};
function readFile() {
	console.log("Reading random.txt...");
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (!err) {
			var dataArr = data.split(',');
			arg = dataArr[0];
			arg2 = dataArr[1];
			for (i = 2; i < dataArr.length; i++) {
				arg2 += arg2 + "+" + dataArr[i];
			}
			commandSwitch();
		}
		else {
			console.log(err);
		}
	});
};
commandSwitch();