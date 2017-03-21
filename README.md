1. This project build with IONIC 1 and angular 1 .


2. All the project module and dependencies can be found in package.json file.


3. To build the project Gulp been used that comes default with ionic 1.


4. Within WWW directory project start with index.html .


5. Template Folder contains all the view template we have in app.


6. Library Directory have all the external third party library like angular , Jquery etc..


7. JS directory it have all the custom javaScript we written. it controll all the app logic.
   
     
	1. app.js contains all the route and there respective controller. it start the angular bootstrap.
     
     
	2. custjs have all the custom js file like SearchController.js have function doRefresh it will called
        
	once we click on search button. Inside this function we have call for SearchFactory.js 
	for all the API
 and GeoLocationFactory used to get lat and long value.
        

8. Image directory all the app images.


9. CSS directory contain both css file default one and style.css where we can write own custom app css.


10. SCSS folder in root directory keep all the ionic component css.


11. Resources directory keep IOS and Android splash sceen and icon of app.


12.Plugins folder store all the module of cordova that used in app.


----

I added two files app.credentials.js and app.credentials.example.js, and added the app.credentials.js file to the .gitignore file.

When you want to download the app you have to rename the app.credentials.example.js file to app.credentials.js

app.credentials.example.js file contain 4 constants
1. URL, used in GeoLocationFactory file
2. searchUrl, used for search link
3. clientID and clientSecret

You have to enter your app details in above constants

--
If you want to encrypt the constants file, use this online tool https://javascriptobfuscator.com/Javascript-Obfuscator.aspx
and paste the encrypted content in the app.credentials.js file
