var Forecast = require('forecast.io');
var fs = require('fs');

var options = {
  APIKey: "f631cb21ca40ee8d0f3a774641ef09dd",   // process.env.FORECAST_API_KEY,
  timeout: 10000
},
forecast = new Forecast(options);
var sgLocation = { "latitude": 1.3059, "longitude": 103.7913 };

function getWeatherNow(locationObj, allOrCurr, func) {
    return forecast.getAtTime(locationObj.latitude, 
                       locationObj.longitude,
                       Math.floor(Date.now()/1000),
                       function(err,res,data) {
        if(err)throw err;
        if(allOrCurr=="all") {
            var weatherData = JSON.parse(JSON.stringify(data));
            func(weatherData);
        } else if(allOrCurr=="curr") {
            var currentData = weatherData.currently; 
            func(weatherData);
        }
    });
}

function getWeatherForDay(options, callback) {
    for (i = 0; i < 24; i++) {
       for (j = 0; j < 2; j++) { 	
            if (j == 0) {
                var time = new Date("June 26, 2015 " + i.toString() + ":00:00").getTime()/1000; // get rid of milliseconds
            } else {
                var time = new Date("June 26, 2015 " + i.toString() + ":30:00").getTime()/1000; // get rid of milliseconds
            }
           forecast.getAtTime(sgLocation.latitude, sgLocation.longitude, time, function (err, res, data) {
                if (err) throw err;
                var dataJSON = JSON.parse(JSON.stringify(data, null, 2));
                console.log(data);
                if(options.csv) {
                    var celsius = Number((dataJSON["currently"]["temperature"]-32)*5/9);
                    var dataNew = (new Date(Number(dataJSON["currently"]["time"])*1000)).toUTCString()
                        + "," + celsius.toString() + "," + dataJSON["currently"]["humidity"] + "\n";
                    fs.appendFile('weather-150626.csv',dataNew, function (err) { if (err) throw err;});
                    //console.log(JSON.stringify(data, null, 2));
                }
               callback(data);
                });
               
           }

    }
}

module.exports = { 
    'getWeatherNow': getWeatherNow,
    'getWeatherForDay':getWeatherForDay
}
