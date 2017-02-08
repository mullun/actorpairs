
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

$(document).foundation();  // reference to ZURB foundation class

var firstName = "Will";
var lastName = "Smith";
var newQueryURL;
var queryURL;
var results;
var personID = 44;
var castQueryURL;

var actorAndMovies = [{		// main data object to hold actors, movies & pairings
		actorFirstName: "",
		actorLastName: "",
		actorID:"",
		actorMovies: [{
			movieName:"",
			movieID:"",
			moviePair:"",
			moviePairID:""
		}]
	}];

var temp = {			// temp variable to hold movie and cast information to be pushed
	movieTitle:"",
	movieID:"",
	moviePair:"",
	moviePairID:""
};

// database.ref().set(actorAndMovies);   // use to create first object in database

// console.log("after first database set");
// console.log(actorAndMovies[0].actorMovies);

var movieID = 88;
var movieTitle;

$("#costars-movies").empty();  // clear the screen of any residue
$("#main-actor-name").empty();  // clear the screen of any residue

// Capture entered information about name of actor
$("#find-cast-info").on("click", function() {

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

	// console.log("queryURL = " + queryURL);

	// get person_id of actor from TMDB
	$.ajax({  
		url: queryURL,  
		method: "GET",
		async: false  // wait for ajax call to return
	}) 
	.done(function(response){   // done getting ID  of actor entered
		console.log("ID of " + firstName + " " + lastName + " retrieved");
		// console.log(actorAndMovies[0].actorMovies);
		// console.log(response.results);
		if (response.results.length >0 ) {
			results = response.results;
			// console.log("results");
			// console.log(results);
			personID = results[0].id;
			// console.log("id of entered actor = " + personID);

			// console.log(actorAndMovies);

			actorAndMovies[0].actorID = personID;
			actorAndMovies[0].actorFirstName = firstName;
			actorAndMovies[0].actorLastName = lastName;
			// database.ref().update(actorAndMovies);

			var tempNameDiv = $("<div>");
			tempNameDiv.addClass("actorNameColumn");
			tempNameDiv.addClass("large-4 medium-4 small-4 columns");
			tempNameDiv.html(firstName + " " + lastName);
			$("#main-actor-name").append(tempNameDiv);

			// Build queryURL to get movies acted by person being queried
			newQueryURL = "https://api.themoviedb.org/3/person/" + personID + "/movie_credits?api_key=47aaffc2100101b29b819d304b4a2a0d&language=en-US";
			// console.log("after getting person ID query = " + newQueryURL);

			$.ajax({
				url: newQueryURL,
				method: "GET",
				async: false 	// make other code wait for ajax to return
			})
			.done(function(movieNames) {  // done getting movies acted by actor entered
				// console.log("movieNames");
				// console.log(movieNames);
				var numberOfMoviesActed = movieNames.cast.length;
				// console.log("numberOfMoviesActed = " + numberOfMoviesActed);
				// console.log(actorAndMovies[0].actorMovies);
				// var j = 1;
				for (var i = 0; i < numberOfMoviesActed; i ++) {
				// for (var i = 0; i < 2; i ++) {

					// console.log("JUST INSIDE NUMBER MOVIES ACTED");

					// for (var x = 0; x < actorAndMovies[0].actorMovies.length; x ++) {
					// 	console.log("x = "+ x + "  " + actorAndMovies[0].actorMovies[x].movieTitle);
					// }

					movieTitle = movieNames.cast[i].title;
					movieID = movieNames.cast[i].id;
					// console.log("movies acted i = " + i);
					// console.log(actorAndMovies[0].actorMovies);
					// console.log("title of movie " + j + " = " + movieTitle);
					// console.log(actorAndMovies[0].actorMovies);
					// console.log("ID of movie " + j + " = " + movieID);
					// j ++;

					// build castQueryURL to get cast of the first movie
					castQueryURL = "https://api.themoviedb.org/3/movie/" + movieID + "/credits?api_key=47aaffc2100101b29b819d304b4a2a0d";

					$.ajax({
						url: castQueryURL,
						method: "GET",
						async: false	// make other code wait for ajax to return
					})
					.done(function(castOfMovies) {
						// console.log("castOfMovies");
						var numberOfCast = castOfMovies.cast.length;
						// console.log("AFTER CAST number of cast members = " + numberOfCast);
						// console.log(actorAndMovies[0].actorMovies);
						// var k = 1;
						// for (var m = 0; m < numberOfCast; m ++) {
						// 	console.log("cast " + k +" = " + castOfMovies.cast[m].name);
						// 	console.log("cast id = " + castOfMovies.cast[m].id);
						// 	k ++;
						// }
						if (numberOfCast > 1) {

							temp.movieTitle = movieTitle;
							temp.movieID = movieID;
							temp.moviePair = castOfMovies.cast[1].name;
							temp.moviePairID = castOfMovies.cast[1].id;


							var tempNamePairDiv = $("<div>");
							tempNamePairDiv.addClass("costarNameColumn");
							tempNamePairDiv.addClass("large-7 medium-7 small-7 columns");
							tempNamePairDiv.html(temp.moviePair);
							$("#costars-movies").append(tempNamePairDiv);

							var tempNameMovieDiv = $("<div>");
							tempNameMovieDiv.addClass("costarNameColumn");
							tempNameMovieDiv.addClass("large-5 medium-5 small-5 columns");
							tempNameMovieDiv.html(temp.movieTitle);
							$("#costars-movies").append(tempNameMovieDiv);



							// console.log(temp);
							// console.log("BEFORE length of array in object = " + actorAndMovies[0].actorMovies.length);
							// for (var x = 0; x < actorAndMovies[0].actorMovies.length; x ++) {
							// 	console.log("x = "+ x + "  " + actorAndMovies[0].actorMovies[x].movieTitle);
							// }

							// console.log(temp);
							// console.log("BEFORE PUSH");
							actorAndMovies[0].actorMovies.push(temp);
							// console.log("var to store");
							// console.log(actorAndMovies[0].actorMovies);
							// console.log("AFTER PUSH");

							// console.log("length of array in object = " + actorAndMovies[0].actorMovies.length);
							// for (var x = 0; x < actorAndMovies[0].actorMovies.length; x ++) {
							// 	console.log("x = "+ x + "  " + actorAndMovies[0].actorMovies[x].movieTitle);
							// }

						}
					})
				}  // go through all the movies acted
				console.log("just before database push");
				// console.log(actorAndMovies[0].actorMovies);
				// database.ref().push(actorAndMovies);
				// parse through relevant information received from IMDB

				// Use Left 2/3 of the screen to place name of actor on the left side and names of co-starts on the right
				//construct the DIVs with appropriate information and place them on the screen

				// console.log("added class attribute to tempDiv");
				// use right 1/3 of screen to place a link for users to buy movies starring one of the actors or one of the co-stars
			});
		// Don't refresh the page!
		return false;
		} else {
			alert("Wrong Info");
			// $('#myModal').foundation('reveal', 'open');
		} // if something received for cast of members

	});  // receiving ID of actor entered
});  // click event done