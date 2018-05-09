# Location-based Quiz - Mobile Application Component

This repository, in conjunction with the ‘**[questions](https://github.com/CoryWilliamsGIS/questions)**’ and ‘**[server](https://github.com/CoryWilliamsGIS/server)**’ repositories creates a location-based quiz system including both web and mobile applications, and a PostgreSQL database hosted on a local web server (three-tier architecture).

This is the repository for the  **mobile quiz application component.**

The application is intended for use by the end user to play their way through a quiz which incorporates the questions set in the web application.

# User Guide
The user guide for the mobile application has recently been uploaded to this repository. It was initially intended for this to be accessible within the mobile application itself (similar to the web application). Unfortunately, this was not achieved. 
Instead, the user guide file can be viewed as intended **[here](https://rawgit.com/CoryWilliamsGIS/quiz/master/ucesccw/www/Mobile_User_Guide.html)**
 

# Demo
 <img src="https://user-images.githubusercontent.com/35572803/39778013-154746e6-52fd-11e8-8ea7-39212db145d8.gif"> 
 
The mobile application:

 1. Displays an embedded leaflet map.
 2. Displays and tracks the users’ current location using GPS on the map.
 3. Retrieves question data from the database, displaying it on the map.
 4. Limits users to answering questions only within 20m of their location.
 5. Submits the answer to the database.
 6. Inform the user if they were correct and if not, what was the correct answer.
 7. Displays question markers differently:
 
•	Further than 20m away (not answerable) – orange

•	Less than or equal to 20m away (answerable) – blue

•	User answered the question correctly – green

•	User answered the question incorrectly - red

# Additional

This application interface is adapted from the [Material Design Lite](https://getmdl.io/templates/index.html) front-end dashboard template. 

The embedded map utilises the [Leaflet API](https://leafletjs.com/). 
