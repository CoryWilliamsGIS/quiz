// Code adapted from: https://github.com/claireellul/cegeg077-week5app/blob/master/ucfscde/www/js/appActivity.js

var client;

var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// Create global marker variables
var testMarkerDRed = L.AwesomeMarkers.icon({ 
	icon: 'play',
	markerColor: 'darkred'
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
	
function loadMap() {	// Load the tiles
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',{
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +	
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);
}

mymap.on('click', function(e) {
	document.getElementById("lat").value = e.latlng.lat;
	document.getElementById("lng").value = e.latlng.lng;
});

function resetForm() {
	document.getElementById("location_name").value = "";
	document.getElementById("question").value = "";
	document.getElementById("answer_1").value = "";
	document.getElementById("answer_2").value = "";
	document.getElementById("answer_3").value = "";
	document.getElementById("answer_4").value = "";
	document.getElementById("lat").value = "";
	document.getElementById("lng").value = "";
}

// Create a variable that will hold the XMLHttpRequest() 
var client2;
	
// Create a variable that will hold the layer itself 
var questionsLayer;

// create the code to get the question data using an XMLHttpRequest
function getQuestions() {
	client2 = new XMLHttpRequest();
	client2.open('GET','http://developer.cege.ucl.ac.uk:30289/getquestions');
	client2.onreadystatechange = questionResponse; // note don't use earthquakeResponse() with brackets as that doesn't work
	client2.send();
}

// Receive the response from the data server, and process it
function questionResponse() {
	// Wait until data is ready - i.e. readyState is 4
	if (client2.readyState == 4) {
		// once the data is ready, process the data
		var questionData = client2.responseText;
		loadQuestionLayer(questionData);
	}
}

// Convert the received data - which is text - to JSON format and add it to the map
function loadQuestionLayer(questionData) {
	// Convert the text to JSON
	var questionJSON = JSON.parse(questionData);
	// Load the geoJSON layer
	var questionsLayer = L.geoJson(questionJSON,
		{
		// Use point to layer to create the points
		pointToLayer: function (feature, latlng)
		{
			// also include a pop-up that shows the location name of the question
			return L.marker(latlng, {icon:testMarkerOrange}).bindPopup("<b>"+feature.properties.location_name +"</b>" + "<p>" + feature.properties.question + "</b>");
			},
		}).addTo(mymap);
	// change the map zoom so that all the data is shown
	mymap.fitBounds(questionsLayer.getBounds());
}





