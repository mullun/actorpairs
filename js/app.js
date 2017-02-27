
// Initialize Firebase
var config = {
apiKey: "AIzaSyA2KqGitL1B_uuTt1Igo20-k0_bMT-bGdc",
authDomain: "actorscasts.firebaseapp.com",
databaseURL: "https://actorscasts.firebaseio.com",
storageBucket: "actorscasts.appspot.com",
messagingSenderId: "211692251452"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

database.ref().on("value", function(snapshot) {
  console.log("got initial dump from DB");
  console.log(snapshot.val());
  console.log(snapshot.val().actorLastName);
});

$(document).foundation();  // reference to ZURB foundation class

var firstName = "Will";
var lastName = "Smith";
var newQueryURL;
var queryURL;
var results;
var personID = 44;
var castQueryURL;

var actorAndMovies = {   // main data object to hold actors, movies & pairings
    actorFirstName: "",
    actorLastName: "",
    actorID:"",
    actorMovies: [{
      movieName:"",
      movieID:"",
      moviePair:"",
      moviePairID:""
    }]
  };

// database.ref().set(actorAndMovies);   // use to create first object in database

// console.log("after first database set");

var movieID = 88;
var movieTitle;

$("#costars-movies").empty();  // clear the screen of any residue
$("#main-actor-name").empty();  // clear the screen of any residue



// Capture entered information about name of actor
$("#find-cast-info").on("click", function() {

  // console.log("click event logged");

  // main data object to hold actors, movies & pairings
  // clear it to get it ready to hold info about this actor
  actorAndMovies.actorFirstName = "";   
  actorAndMovies.actorLastName = "";
  actorAndMovies.actorID = "";
  actorAndMovies.actorMovies = [];

  $("#costars-movies").empty();  // clear the screen of any residue
  $("#main-actor-name").empty();  // clear the screen of any residue

  // get first and last name of actor for whom cast information is to be found
  firstName = $("#first-name-input").val().trim();
  lastName = $("#last-name-input").val().trim();

  // Clear the textbox when done
  $("#first-name-input").val("");
  $("#last-name-input").val("");

  // Build queryURL to get person ID of the actor being querried
  queryURL = "https://api.themoviedb.org/3/search/person?api_key=47aaffc2100101b29b819d304b4a2a0d&language=en-US&query=" + firstName + " " + lastName + "&include_adult=false";
  // get person_id of actor from TMDB
  $.ajax({  
    url: queryURL,  
    method: "GET",
    async: false  // wait for ajax call to return
  }) 
  .done(function(response) {   // done getting ID  of actor entered
    console.log("ID of " + firstName + " " + lastName + " retrieved");
    // console.log(actorAndMovies[0].actorMovies);
    // console.log(response.results);
    if ( response.results.length > 0 ) {
      // something valid came back from TMDB
      results = response.results;
      personID = results[0].id;
      actorAndMovies.actorID = personID;
      actorAndMovies.actorFirstName = firstName;
      actorAndMovies.actorLastName = lastName;

      var tempNameDiv = $("<div>");
      tempNameDiv.addClass("actorNameColumn");
      tempNameDiv.addClass("large-4 medium-4 small-4 columns");
      tempNameDiv.html(firstName + " " + lastName);
      // Put the name of actor on screen
      $("#main-actor-name").append(tempNameDiv);
      getNamesOfMovies(personID);
      // database.ref().push(actorAndMovies);
      console.log(actorAndMovies);
    }  // if something received for cast of member
    else {
      alert("Wrong Info");  // actor name is incorrect
    }
  });    
});

// ---------------------------------------------

function getNamesOfMovies(actorTmdId) {
  // Build queryURL to get movies acted by person being queried
  var newQueryURL = "https://api.themoviedb.org/3/person/" + actorTmdId + "/movie_credits?api_key=47aaffc2100101b29b819d304b4a2a0d&language=en-US";
  $.ajax({
    url: newQueryURL,
    method: "GET",
    async: false  // make other code wait for ajax to return
  })
  .done(function(movieNames) {  // done getting movies acted by actor queried
    var numberOfMoviesActed = movieNames.cast.length;
    getCastOfMovies(movieNames, numberOfMoviesActed);
  })
}  // getNamesOfMovies function

// ---------------------------------------------

// get ID of movie and make a call to fetch Co-Star detail for that movie
function getCastOfMovies(namesOfMovies, numberOfMovies) {
  for ( i = 0; i < numberOfMovies; i ++) {
    movieTitle = namesOfMovies.cast[i].title;
    movieID = namesOfMovies.cast[i].id;
    var localMovieID = movieID;
    getCostarMovieDetails(localMovieID);
  }
}

// ---------------------------------------------

// Get name and ID of MAIN (index 1) co-Star for movieID given
function getCostarMovieDetails(lMovieID) {
  var castQueryURL = "https://api.themoviedb.org/3/movie/" + lMovieID + "/credits?api_key=47aaffc2100101b29b819d304b4a2a0d";
  $.ajax({
    url:castQueryURL,
    method: "GET",
    async: false  // make other code wait for ajax to return
  })
  .done(function(castOfMovies) {
    // temp variable to hold movie and cast information to be pushed
    var temp = {
      movieTitle:"",
      movieID:"",
      moviePair:"",
      moviePairID:""
    };
    var numberOfCast = castOfMovies.cast.length;
    if (numberOfCast > 1) {
      temp.movieTitle = movieTitle;
      temp.movieID = movieID;
      temp.moviePair = castOfMovies.cast[1].name;
      temp.moviePairID = castOfMovies.cast[1].id;

      // Put name of CoStar on screen
      var tempNamePairDiv = $("<div>");
      tempNamePairDiv.addClass("costarNameColumn");
      tempNamePairDiv.addClass("large-7 medium-7 small-7 columns");
      tempNamePairDiv.html(temp.moviePair);
      $("#costars-movies").append(tempNamePairDiv);

      // Put name of Movie on screen
      var tempNameMovieDiv = $("<div>");
      tempNameMovieDiv.addClass("costarMovieColumn");
      tempNameMovieDiv.addClass("large-5 medium-5 small-5 columns");
      tempNameMovieDiv.html(temp.movieTitle);
      $("#costars-movies").append(tempNameMovieDiv);

      // store name of movie, name of costar, id of movie, id of costar
      actorAndMovies.actorMovies.push(temp);    
    }
  })
}
// ---------------------------------------------
// when user clicks on the name of a movie to watch
$(document).on ("click", ".costarMovieColumn", function () {
  console.log("movie name clicked");
  var pairMovieName = $(this).text();
  // console.log("clicked movie name = " + pairMovieName);
  alert("Nice Choice " + pairMovieName);
});
