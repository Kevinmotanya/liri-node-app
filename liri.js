// read/set environment modue (NPM module .env)
require("dotenv").config();

// loading the required node modules for movie API
var request = require('request');
//NPM module for moments
var moment = require('moment');
// spotify access keys for the CLI application
var Spotify = require('node-spotify-api');
//NPM module that loads the random.txt file
var fs = require("fs");

// loading the required keys for the CLI application
var keys = require("./keys.js");
//access keys information
var spotify = new Spotify(keys.spotify);
//node Arguments
var myArgs = process.argv;
//storing the liri expression and declaring it as a var...for switch case
var liri = process.argv[2];

var search = "";


// loop  through var i as long as the search params are more than 3 chars,.do search using the arguments from user input 
for (var i = 3; i < myArgs.length; i++) {

  if (i > 3 && i < myArgs.length) {
    search = search + " " + myArgs[i];
  }else {
    search += myArgs[i];
  }
}


//Switch/Case to navigate between liris 4 instances our the CLI application 
switch (liri) {
  // add commandline for the bands API
  case "concert-this":
    if (search) {
      // console.log output that Liri is looking for concerts for the specified artist
      console.log("\nGreat...These are the concerts Kevin's liri came across " + search + ".")
      // function callback to find concerts
      findConcert(search);
    }
    //break when done with concer-this case and go to next case
    break;
  // target point for Spotify API
  case "spotify-this-song":
    if (search) {
      // console.log that Liri is sopotifying the song
      console.log("\n This is what Kevin's liri Spotify search for " + search + "found")
      // call the spotifySong function
      spotifySong(search);
      // else (if Liri doesn't find the song, or no input was made, spotify will search for all the small things)
    } else {
      var search = "All The Small Things"
      spotifySong(search)
    }
    break;
  //  add command line for imdb API
  case "movie-this":
    if (search) {
      // log that Liri is searching for the movie
      console.log("\nSure...Kevin's liri IMDB has found" + search + ".")
      // call the getMovie function
      omdbMovie(search);
    } else {
      var search = "Mr. Nobody"
      //
      console.log("If you haven't watched Mr. Nobody then you should: http://www.imdb.com/title/tt0485947/ \n")
      console.log("It's on Netflix")
      omdbMovie(search);
    }
    break;

  // add command line do-what-it-says
  case "do-what-it-says":
    doAsLiriSays();
    break;

  default:
    console.log("node liri.js concert-this' and artist\n, node liri.js spotify-this-song and a song title\n, node movie-this and the movie title\n, node liri.js do-what-it-says")

}

// function for finding a concert CONCERT-THIS
//using bandsintown api to get info
function findConcert(search) {
  request("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp", function (error, response, body) {

    //  if no error and statusCode is 200 then the request was received and understood and is being processed
    if (!error && response.statusCode === 200) {

      // loop through the body (response)
      for (i = 0; i < body.length; i++) {

        // set the the data and parsing it into a string, store in a variable called concertInfo
        var concertInfo = JSON.parse(body)[i]

        // console.log the selected info for display while using moment for datetime display
        console.log("\nResults from bandsintown...with moments date format")
        console.log("Name of venue: " + concertInfo.venue.name)
        console.log("Location: " + concertInfo.venue.city)
        //date format MM/DD/YYYY
        console.log("EventDate:" + moment(concertInfo.datetime).format("MM/DD/YYYY"));
         console.log("=x=xxx=xx=Do another Search=x=xx=xxx=")
      }

    }

  });

}

// function a song searched SPOTIFY-THIS-SONG
function spotifySong(search) {
  // retrieve resources from spotify api by sending a get request
  //returns two params...error, info
  spotify.search({ type: 'track', query: search }, function (error, info) {

    //condition to state what happens if theres a search error
    if (error) {
//prints out the error message
      return console.log('Sorry! search error: ' + err);

      // else if no error, search info is returned with artist name, preview url and album name
    } else {
      // printout the info of the search result
      //spotify returns 20 results but we set our item to just one result [0]
      //var songInfo=info.tracks.items[0]
      var songInfo = info.tracks.items[0]
      
            //prints out the artist name
      console.log("Artist: " + songInfo.artists[0].name);
      //prints out the artist name
      console.log("Song Title: " + songInfo.name);
      //prints out a preview link of the song from spotify
      console.log("Listen Here: " + songInfo.preview_url);
      //prints out the album name
      console.log("Album Title: " + songInfo.album.name);
      console.log("=x=xxx=xx=Do another Search=x=xx=xxx=")
    }

  })
}

// function for searching Movie info MOVIE-THIS
function omdbMovie(search) {

  var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function (error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // set the data to a variable
      var movieInfo = JSON.parse(body)

      // print out to node information about the movie
      
         
       console.log("\nResults from...")
      console.log("---\nOmDb---")
       // title the movie
      console.log("Movie Title: " + movieInfo.Title)
        //title
      console.log("Release Year: " + movieInfo.Year)
        //imdb rating
      console.log("IMBD Rating: " + movieInfo.imdbRating)
       //imdb rating val
      console.log("Rotten Tomatoes Rating: " + movieInfo.Ratings[0].Value)
       //country produced in 
      console.log("Produced In: " + movieInfo.Country)
      //language movie is produced in
      console.log("Language: " + movieInfo.Language)
      //movie actor
      console.log("Actors: " + movieInfo.Actors)
       //plot of the movie
      console.log("\nPlot: " + movieInfo.Plot)
      console.log("=x=xxx=xx=Do another Search=x=xx=xxx=")
    }
  });
}

//function that does DO-WHAT-IT-SAYS
function doAsLiriSays() {

  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log('Sorry error reading' + error);
    }

    // data.split method splits the string to make it more readable
    var liriCmd = data.split(",")

    // run the concert function for liriCmd[1]
    if (liriCmd[0] === "spotify-this-song") {

      var search = liriCmd[1]
      //callback the spotify search function
      spotifySong(search);
      console.log(search)

    }

  });
};