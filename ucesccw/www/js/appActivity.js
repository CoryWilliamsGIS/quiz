// Code adapted from: https://github.com/claireellul/cegeg077-week5app/blob/master/ucfscde/www/js/appActivity.js
    // load the map

    var mymap = L.map('mapid').fitWorld();

    // load the tiles

    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {

      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',

      maxZoom: 18,

      id: 'mapbox.streets'
	  
	 }).addTo(mymap);
	 
	 mymap.locate({setView: true, maxZoom: 18});

	// create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the same variable 
	
	var client;
	
	// and a variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on
	


	// create custom red marker
	var testMarkerRed = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'red'
});

	// create custom pink marker 
	var testMarkerPink = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'pink'
});
	// create the code to wait for the response from the data server, and process the response once it is received




/* Adapted from: https://www.w3schools.com/html/html5_geolocation.asp
&
https://gis.stackexchange.com/questions/182068/getting-current-user-location-automatically-every-x-seconds-to-put-on-leaflet */



//Tracking location


var initialTracking = true;
var userLocation;
var autoPan = false;

function trackLocation() {
	if (!initialTracking){
	// zoom to center
		mymap.fitBounds(userLocation.getLatLng().toBounds(250));
		autoPan = true;
		
		
	} else {
		if (navigator.geolocation) {
			alert("Finding your position!");
			navigator.geolocation.watchPosition(showPosition);
			
			
		//error handing	
		} else {
			alert("Geolocation is not supported by this browser.");
		}
	}
}

function showPosition(position) {

	if(!initialTracking){
		mymap.removeLayer(userLocation);
	}
	userLocation = L.marker([position.coords.latitude,position.coords.longitude], {icon:testMarkerPink}).addTo(mymap);
						
	
	
	if(initialTracking){
		initialTracking = false;
		mymap.fitBounds(userLocation.getLatLng().toBounds(250));
		autoPan = true;
	}else if (autoPan) {
		mymap.panTo(userLocation.getLatLng());
		
	}	
}






qMarkers = [];









	// create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the same variable 
	
	var client2;
	
	// and a variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on
	
	var questionsLayer;

	// create the code to get the Earthquakes data using an XMLHttpRequest
	function getQuestions() {
	client2 = new XMLHttpRequest();
	client2.open('GET','http://developer.cege.ucl.ac.uk:30289/getquestions');
	client2.onreadystatechange = questionResponse; // note don't use earthquakeResponse() with brackets as that doesn't work
	client2.send();
}

	// create custom red marker
	var testMarkerRed = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'red'
});

var testMarkerGreen = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'green'
});

var testMarkerBlue = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'blue'
});

var testMarkerOrange = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'orange'
});

	// create the code to wait for the response from the data server, and process the response once it is received
	
	function questionResponse() {
	
	// this function listens out for the server to say that the data is ready - i.e. has state 4
	
	if (client2.readyState == 4) {
	// once the data is ready, process the data
	
	var questionData = client2.responseText;
	loadQuestionLayer(questionData);
}
}

	// convert the received data - which is text - to JSON format and add it to the map
	function loadQuestionLayer(questionData) {
	
	// convert the text to JSON
	var questionJSON = JSON.parse(questionData);
	
	// load the geoJSON layer
	var questionsLayer = L.geoJson(questionJSON,
{
	// use point to layer to create the points
	pointToLayer: function (feature, latlng)
{
	// look at the GeoJSON file - specifically at the properties - to see the earthquake magnitude and use a different marker depending on this value
	// also include a pop-up that shows the place value of the earthquakes

	layer_marker = L.marker(latlng, {icon:testMarkerOrange}) //
	layer_marker.bindPopup("<b>"+feature.properties.location_name +"</b>");
	
	//return L.marker(latlng, {icon:markerOrange}).bindPopup("<b>"+feature.properties.location_name +"</b>" + "<p>" + feature.properties.question + "</b>");

	qMarkers.push(layer_marker);
	
	return layer_marker;
},
}).addTo(mymap);
	
	// change the map zoom so that all the data is shown
	mymap.fitBounds(questionsLayer.getBounds());
}


function availableQuestions(){
	checkQuestionDistance(qMarkers);
}


function checkQuestionDistance(questionMarkers){
	
	latlng = userLocation.getLatLng();
	alert("Checking if you are within 20m of any question marker"); 
	alert(latlng); 

	for(var i=0; i<questionMarkers.length; i++) {
	    currentMarker = questionMarkers[i];
	    currentMarker_latlng = currentMarker.getLatLng();

	    var distance = getDistanceFromLatLonInM(currentMarker_latlng.lat, currentMarker_latlng.lng, latlng.lat, latlng.lng);

	    if (distance <= 20) {
            questionMarkers[i].setIcon(testMarkerBlue);
			questionMarkers[i].on('click', onClick);
		
        } else {
        	questionMarkers[i].setIcon(testMarkerOrange);
			questionMarkers[i].bindPopup("Get closer to the question to answer!");
        }
	}
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

var clickedMarker;

function onClick(e) {

	alert(this.feature.properties.question);

	showClickedQuestion(this);
	clickedMarker = this;
}


function showClickedQuestion(clickedQuestion) {

	document.getElementById('questionDiv').style.display = 'block';
	document.getElementById('mapid').style.display = 'none';
	document.getElementById("question").value = clickedQuestion.feature.properties.question;
	document.getElementById("answer_1").value = clickedQuestion.feature.properties.answer_1;
	document.getElementById("answer_2").value = clickedQuestion.feature.properties.answer_2;
	document.getElementById("answer_3").value = clickedQuestion.feature.properties.answer_3;
	document.getElementById("answer_4").value = clickedQuestion.feature.properties.answer_4;
	
	document.getElementById("check1").checked = false;
	document.getElementById("check2").checked = false;
	document.getElementById("check3").checked = false;
	document.getElementById("check3").checked = false;
	
	clickedMarker = clickedQuestion;
}


function validateData() {
        var a=document.getElementById("check1").checked;
        var b=document.getElementById("check2").checked;
        var c=document.getElementById("check3").checked;
        var d=document.getElementById("check4").checked; 

        if (a==false && b==false && c==false && d==false)
        {
            alert("Please fill in all fields.");
           return false; //this commented out works but the then next question is auto checked........... sort out
        }
        else 
        {
	              
        	startDataUpload()
        }
}

var answerTrue;
function startDataUpload() {
	alert ("Submitting your answer!");

//	var location_name = document.getElementById("location_name").value;

	var cAnswer = clickedMarker.feature.properties.answer_correct;
	var question = document.getElementById("question").value;

//	var answer_1 = document.getElementById("answer_1").value;
//	var answer_2 = document.getElementById("answer_2").value;
//	var answer_3 = document.getElementById("answer_3").value;
//	var answer_4 = document.getElementById("answer_4").value;

//	var lat = document.getElementById("lat").value;
//	var lng = document.getElementById("lng").value;

//	alert(Your chosen answer is );
	var answer;
	var postString = "question="+question; //= "answer="+answer;
//var postString = "location_name="+location_name +"&question="+question +"&answer_1="+answer_1 +"&answer_2="+answer_2 +"&answer_3="+answer_3+ "&answer_4="+answer_4;
	// now get the radio button values
	if (document.getElementById("check1").checked) {
		answer = 1;
        postString=postString+"&answer="+answer;
    }
    if (document.getElementById("check2").checked) {
		answer = 2;
    	postString=postString+"&answer="+answer;
    }
	if (document.getElementById("check3").checked) {
		answer =3;
		postString=postString+"&answer="+answer;
	}
	if (document.getElementById("check4").checked) {
		answer =4;
		postString=postString+"&answer="+answer;
	}
	if (answer == cAnswer) {
		alert("Correct!");
		answerTrue = true;
	} else {
		alert("Sorry, that is incorrect! \n The correct answer is: " + cAnswer);
		answerTrue = false;
	}
		
	postString = postString + "&cAnswer="+cAnswer;
	//postString = postString + "&lat=" + lat + "&lng=" + lng;

	//alert ("Your chosen answer is: "+answer);
	//alert 

	processData(postString);
}

var client;

function processData(postString) {
   client = new XMLHttpRequest();
   client.open('POST','http://developer.cege.ucl.ac.uk:30289/uploadAnswer',true);
   client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   client.onreadystatechange = answerUploaded;  
   client.send(postString);
}

// create the code to wait for the response from the data server, and process the response once it is received
function answerUploaded() {
  // this function listens out for the server to say that the data is ready - i.e. has state 4
  if (client.readyState == 4) {
    // change the DIV to show the response
 //   document.getElementById("answerUploadResult").innerHTML = client.responseText;
	document.getElementById('questionDiv').style.display = 'none';
	document.getElementById('mapid').style.display = 'block';
  }


