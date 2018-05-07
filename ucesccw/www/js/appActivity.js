/* Code adapted from: https://github.com/claireellul/cegeg077-week5app/blob/master/ucfscde/www/js/appActivity.js
&
https://github.com/claireellul/cegeg077-week6formcode */

// Assigns leaflet map 
var mymap = L.map('mapid').fitWorld();

// load the map tiles
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets'
}).addTo(mymap);
	 
mymap.locate({setView: true, maxZoom: 18});

// Create global marker variables
var testMarkerPink = L.AwesomeMarkers.icon({ 
	icon: 'play',
	markerColor: 'pink'
	});

var testMarkerRed = L.AwesomeMarkers.icon({ 
	icon: 'play',
	markerColor: 'red'
	});
	
var testMarkerGreen = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'darkgreen'
	}); 
 
var testMarkerOrange = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'orange'
	}); 

var testMarkerBlue = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'blue'
});
	
	

/* Code Adapted from:
https://www.w3schools.com/html/html5_geolocation.asp
&
https://gis.stackexchange.com/questions/182068/getting-current-user-location-automatically-every-x-seconds-to-put-on-leaflet */

// Variables used in location tracking 
var initialTracking = true;
var userLocation;
var userLocationRadius; // variable for adding circle around the user 
var autoPan = false;

// track the location of the user using GPS,pan to their location and update if the user moves
function trackLocation() {
	if (!initialTracking){
		// Center on the location of the user
		mymap.fitBounds(userLocation.getLatLng().toBounds(250));
		autoPan = true;
	} else {
		if (navigator.geolocation) {
			alert("Finding your position!");
			navigator.geolocation.watchPosition(showPosition);
		//Handling errors if GPS fix cannot be obtained
		} else {
			alert("Geolocation is not supported by this browser.");
		}
	}
}

/* 	Display user position as pink marker
	Display a 20m circle around the pink marker
	Center map on user */
function showPosition(position) {
	if(!initialTracking){
		mymap.removeLayer(userLocation);
		mymap.removeLayer(userLocationRadius); 
	}
	// Circle radius 
	var radius = 20; 
	// Add user's current location to Leaflet map as pink marker
	userLocation = L.marker([position.coords.latitude,position.coords.longitude], {icon:testMarkerPink}).addTo(mymap);	
	// Add a circle with a radius of 20m around the user's current location on the Leaflet map
	userLocationRadius = L.circle([position.coords.latitude,position.coords.longitude], radius).addTo(mymap);					
	if(initialTracking){
		initialTracking = false;
		mymap.fitBounds(userLocation.getLatLng().toBounds(250));
		autoPan = true;
	}else if (autoPan) {
		mymap.panTo(userLocation.getLatLng());	
	}	
}

// Empty array which will be used to store question point markers 
qMarkers = [];

// Variable that will hold the XMLHttpRequest()	
var client2;
	
// Variable that will be used to store the points	
var questionPoints;

// create the code to get the question data using an XMLHttpRequest
function getQuestions() {
	client2 = new XMLHttpRequest();
	client2.open('GET','http://developer.cege.ucl.ac.uk:30289/getquestions');
	client2.onreadystatechange = questionResponse; 
	client2.send();
}

// Receive the response from the data server, and process it
function questionResponse() {
	// Wait until data is ready - i.e. readyState is 4
	if (client2.readyState == 4) {
		// once the data is ready, process the data
		var qData = client2.responseText;
		loadQuestionPoints(qData);
	}
}

// Convert the received data from text to JSON and add it to the Leaflet map
function loadQuestionPoints(qData) {
	// Convert text to JSON
	var questionJSON = JSON.parse(qData);
	// Load question points as GeoJSON
	var questionPoints = L.geoJson(questionJSON,
	{
	// Use point to layer to create the question points
	pointToLayer: function (feature, latlng)
	{
		//Create orange marker for each question in the database
		pointMarker = L.marker(latlng, {icon:testMarkerOrange}) 
		//Add a pop up to the marker with the location name property of that question
		pointMarker.bindPopup("<b>"+feature.properties.location_name +"</b>");
	
		//Push the markers to the qMarkers array
		qMarkers.push(pointMarker);
	
		return pointMarker;
	},
	}).addTo(mymap);
	
	// Change the map zoom so that all questions are visible
	mymap.fitBounds(questionPoints.getBounds());
}

/*Adapted from:
https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript 
&
https://www.geodatasource.com/developers/javascript */
function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  var d2 = d * 1000;
  return d2;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// Function activated by pressing navigation link 'Answer Questions' in app menu
function closeDistanceQuestions(){
	checkQuestionDistance(qMarkers);
}

// Determine the users distance from each question marker 
function checkQuestionDistance(questionMarkers){
	// Get users current location
	latlng = userLocation.getLatLng();
	alert("Checking if you are within 20m of any question"); 
	/* Iterate through each question to determine if any are within 
	20m of the users location */
	for(var i=0; i<questionMarkers.length; i++) {
	    currentMarker = questionMarkers[i];
	    currentMarker_latlng = currentMarker.getLatLng();
		// Assign to the distance variable
	    var distance = getDistanceFromLatLonInM(currentMarker_latlng.lat, currentMarker_latlng.lng, latlng.lat, latlng.lng);
		// Make marker blue if question within 20m and allow the user to answer
	    if (distance <= 20) {
            questionMarkers[i].setIcon(testMarkerBlue);
			questionMarkers[i].on('click', onClick);
		// Keep marker orange if not within 20m and do not allow question to be answered
        } else {
        	questionMarkers[i].setIcon(testMarkerOrange);
			questionMarkers[i].bindPopup("Get closer to the question to answer!");
        }
	}
}	

// Global variable for the clicked marker
var mClicked;

// The marker clicked on the leaflet map is assigned and the qClicked function initiated 
function onClick(e) {
	qClicked(this);
	mClicked = this;
}

function qClicked(clickedQuestion) {
	// AJAX alternative
	// Replace leaflet map div with div holding the question 
	document.getElementById('questionDiv').style.display = 'block';
	document.getElementById('mapid').style.display = 'none';
	// Retrieve the relevant information
	document.getElementById("question").value = clickedQuestion.feature.properties.question;
	document.getElementById("answer_1").value = clickedQuestion.feature.properties.answer_1;
	document.getElementById("answer_2").value = clickedQuestion.feature.properties.answer_2;
	document.getElementById("answer_3").value = clickedQuestion.feature.properties.answer_3;
	document.getElementById("answer_4").value = clickedQuestion.feature.properties.answer_4;
	/*Create the way the user will answer the question
	Make all buttons unchecked initially */
	document.getElementById("radioCheck1").checked = false;
	document.getElementById("radioCheck2").checked = false;
	document.getElementById("radioCheck3").checked = false;
	document.getElementById("radioCheck4").checked = false;
	mClicked = clickedQuestion;
}

// Error handing - ensure a radio button is checked
function validateUserAnswer() {
        var c1=document.getElementById("radioCheck1").checked;
        var c2=document.getElementById("radioCheck2").checked;
        var c3=document.getElementById("radioCheck3").checked;
        var c4=document.getElementById("radioCheck4").checked; 
        if (c1==false && c2==false && c3==false && c4==false)
        {
            alert("Please select an answer.");
			return false;
        }
        else 
        {        
        	uploadAnswer()
        }
}

// Variable used to determine if user answer is correct
var answerTrue;

// Submit answer to the database 
function uploadAnswer() {
	alert ("Submitting your answer!");
	// Assign the question's correct answer
	var cAnswer = mClicked.feature.properties.answer_correct;
	// Assign the question
	var question = document.getElementById("question").value;
	// Variable used to assign the users answer
	var answer;
	// Variable used in uploading the relevant information to the app_answers database table
	var postString = "question="+question; 

	// now get the radio button values
	if (document.getElementById("radioCheck1").checked) {
		answer = 1;
        postString=postString+"&answer="+answer;
    }
    if (document.getElementById("radioCheck2").checked) {
		answer = 2;
    	postString=postString+"&answer="+answer;
    }
	if (document.getElementById("radioCheck3").checked) {
		answer =3;
		postString=postString+"&answer="+answer;
	}
	if (document.getElementById("radioCheck4").checked) {
		answer =4;
		postString=postString+"&answer="+answer;
	}
	//Determine if the user got the question correct and alert them appropriately
	if (answer == cAnswer) {
		alert("Correct!");
		answerTrue = true;
	} else {
		alert("Sorry, your answer of " +answer+" is incorrect! \n The correct answer is: " + cAnswer);
		answerTrue = false;
	}
	postString = postString + "&cAnswer="+cAnswer;
	processAnswer(postString);
}

// Variable that will hold the XMLHttpRequest()
var client; 

// Uploads answer data in postString variable to the database using XMLHttpRequest(
function processAnswer(postString) {
   client = new XMLHttpRequest();
   client.open('POST','http://developer.cege.ucl.ac.uk:30289/uploadAnswer',true);
   client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   client.onreadystatechange = answerUploaded;  
   client.send(postString);
}

// Receive the response from the data server and process it
function answerUploaded() {
  // Wait until data is ready - i.e. readyState is 4
  if (client.readyState == 4) {
    // Once the data is ready, process the data
	// AJAX Alternative 
	// Switch the div back to leaflet map
	document.getElementById('questionDiv').style.display = 'none';
	document.getElementById('mapid').style.display = 'block';
		/* If user answer is correct - make question marker green,
		if user answer incorrect - make question marker red */
		if (answerTrue) {
			mClicked.setIcon(testMarkerGreen);
		} else {
			mClicked.setIcon(testMarkerRed);
		}
    }
}

