
/***************************************HASH*************************************************/
var stringHash = require('string-hash');
var Hashids = require('hashids');
var hashids = new Hashids("fms energy app");

/*************************************MISC LIBS**********************************************/
var Q = require('q');
var request = require('request');
var helper = require('./helper');
var weather = require('./weather');
var private = require('./private/auth');

/*************************************DATABASE***********************************************/
var Oio = require('orchestrate');
Oio.ApiEndPoint = "api.ctl-sg1-a.orchestrate.io";
var db = Oio(private.orchestrateKey);


/***************************************VARS*************************************************/
var sgLocation = { "latitude": 1.3059, "longitude": 103.7913 };
var nyLocation = { "latitude": 40.714224, "longitude": -73.961452   }; 
var ruLocation = { "latitude": 63.297044, "longitude": 118.007202 };
var route_ctry; //for key_val
var key_val; //currently unused: hashes route_ctry and Date.now() to get a unique key.

/***************************************FUNCS*************************************************/

function weatherInfo(location, time) {
    var def = Q.defer();
    weather.getWeatherNow(location, time).done(function(weather_data) {
        var current_temp_obj = { 
            "time": new Date(time*1000), 
            "latitude": location.latitude,
            "longitude": location.longitude,
            "temperature": weather_data.currently.temperature
        };
        def.resolve(current_temp_obj);
       // console.log(current_temp_obj);
   //db.post('currentTemperature', current_temp_obj).then(function(result) { console.log("success"); }).fail(function(err) { console.log(err); } );
    });
    return def.promise;
}
function forecastInfo(location, date) {
    var def = Q.defer();
    weather.getForecast(location, date).done(function(forecast_data) {
        var forecast_obj = {
            "date": helper.dateString(date),
            "latitude": location.latitude,
            "longitude": location.longitude,
            "forecast": forecast_data
        };
        //console.log(forecast_obj);
        def.resolve(forecast_obj);
  //  db.post('dailyForecasts', forecast_obj).then(function(result) { console.log("success"); }).fail(function(err) { console.log(err); } );
    });
    return def.promise;
}

//weatherInfo(sgLocation, helper.getTimeNow());
//forecastInfo(sgLocation, new Date());


module.exports = {
    'weatherInfo': weatherInfo,
    'forecastInfo': forecastInfo
}