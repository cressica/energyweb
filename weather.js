/**
Rewritten the getWeatherNow function to utilise Promises, which are used in the main app.js to handle the async calls.
**/

var fs = require('fs');
var Q = require('q');
var private = require('./private/auth');
var Forecast = require('forecast.io');
var options = {
  APIKey: private.forecastIO_APIKey,   // process.env.FORECAST_API_KEY,
  timeout: 10000
};
var forecast = new Forecast(options);
var apiCallOpts = { units: "si" };

var weather_data;
var current_data;

/**
Returns the 'currently' field from the weather object from Forecast.io for that specific time and latlng.

@param locationObj in the format { latitude: ###, longitude: ### }
@param timeVal in the format of timeInMillis(), except without milliseconds. e.g. (Date.now())/1000
@returns returns a Promise object with either an error or the weatherObject.currently object (see sampleWeatherData.json)
**/
function getWeatherNow(locationObj, timeVal) {
    var def = Q.defer();
    forecast.getAtTime(locationObj.latitude, 
                       locationObj.longitude,
                       timeVal,
                       apiCallOpts,
                       function(err,res,data) {
        
        
        if (data.currently == null) {
            def.reject("No data available");
        }
        if(err) def.reject(err);
        else def.resolve(data);
    });
    return def.promise;                            
}

function getForecast(loc, date) {
    var def = Q.defer();
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    var forecastArray = [];
    var writeFileArray = [];
    var fileName = "" + day + month + year + "_" + loc.latitude + ", " + loc.longitude + ".csv";
    if (fs.existsSync(fileName)) {
        return;
    }
    for (i = 0; i < 24; i++) {
       for (j = 0; j < 2; j++) { 	
            if (j == 0) {
                var time =  new Date("" + month + "/ " + day + "/" + year + " " + i.toString() + ":00:00").getTime()/1000; 
            } else {
                var time = new Date("" + month + "/ " + day + "/" + year + " " + i.toString() + ":30:00").getTime()/1000;
            }
            forecastArray.push(forecastHelper(loc, time));
           }
    }
    Q.all(forecastArray).then(function(data) {
        def.resolve(data);
    });
    return def.promise;
}

function forecastHelper(locationObj, timeVal) {
    var def = Q.defer();
    forecast.getAtTime(locationObj.latitude, 
                       locationObj.longitude,
                       timeVal,
                       apiCallOpts,
                       function(err,res,data) {
        
        
        if (data ==null || data.currently == null) {
            def.reject("No data available");
        }
        if(err) def.reject(err);
        else def.resolve(data.currently);
    });
    return def.promise;                            
}



module.exports = {
    'getWeatherNow': getWeatherNow,
    'getForecast': getForecast
}