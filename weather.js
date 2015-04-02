//---------------------------------------------------------------------------------------------------
//Command line app using Node.js to retrive the current weather of a given zip code from forecast.io
//---------------------------------------------------------------------------------------------------

var http = require("http");
var https = require("https");

//Print out message
function printWeather(temp, cond) {
  var message = "Current Weather: " + temp + " and " + cond;
  console.log(message);
  console.log("Enter another zip code: ");
}

//Print out error messages
function printError(error){
  console.error(error.message);
}

function getCoord(zip) {
  //Connnect to the zippopotam.us API 
  var req = http.get("http://api.zippopotam.us/us/" + zip, function(res){
    var body = "";
    
    //Read the data
    res.on("data", function (chunk) {
      body += chunk;
    });
    
    res.on("end", function(){
      if(res.statusCode === 200) {
        try {
          //Parse the data
          var weather = JSON.parse(body);
          //Print the data
          var latitude = weather.places[0].latitude;
          var longitude = weather.places[0].longitude;
          getWeather(latitude, longitude);

        } catch(error) {
          //Parse Error
          printError(error);
        }
      } else {
        //Status Code Error
        printError({message: "There was an error getting the zip code for " + zip + ". (" + http.STATUS_CODES[res.statusCode] + ")"});
      }
      
    }); 
  });

  //Connection Error
  req.on("error", printError);
}

function getWeather(latitude, longitude) {
  //Connect to the forecast.io API
  var req = https.get("https://api.forecast.io/forecast/90b2395db1ca4f3593359e31c3490284/" + latitude + "," + longitude, function(res) {
    var body = "";

    res.on("data", function(chunk){
      body += chunk;
    });

    res.on("end", function() {
      if(res.statusCode === 200){
        try {
          var forecast = JSON.parse(body);
          var temperature = Math.round(forecast.currently.temperature);
          var condition = forecast.currently.summary;

          printWeather(temperature, condition);

        } catch(error) {
          printError(error);
        }
      } else {
        printError({message: "There was an error getting the forecast for " + latitude + " " + longitude + ". (" + http.STATUS_CODES[res.statusCode] + ")"});
      }
    });
  });
}

module.exports.forecast = getCoord;