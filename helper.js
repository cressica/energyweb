function halfHourly(dateObj) {
    if ( dateObj.getMinutes() < 30 ) {
        dateObj.setMinutes(0);
    } else if (dateObj.getMinutes() < 60 ) {
        dateObj.setMinutes(30);
    } else {
        throw "Invalid Date";
    }
    dateObj.setMilliseconds(0);
    return dateObj.setSeconds(0);
}

function dateString(date_obj) {
    var monthVal = date_obj.getMonth() + 1;
    return "" + monthVal + "/" + date_obj.getDate() + "/" + date_obj.getFullYear();
}

// currently unused: might be useful later for displaying location as text to user.
function getPlaceName(lat, long, callback) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&sensor=true";
    return request({ method: "GET", url: url, json: true}, function(err, msg, data) {
        var rt = "" ; var ctry = "";
        var addr = data["results"][0]["address_components"];
        for (var i=0; i<addr.length; i++) {
            for (var j=0; j<addr[i]["types"].length; j++) {
                if (addr[i]["types"][j] == "route") {
                    rt = addr[i]["long_name"];
                }
                if (addr[i]["types"][j] == "country") {
                    ctry = addr[i]["long_name"];
                }
            }
        }
        route_ctry = "" + rt + " " + ctry;
        callback(err, msg, data);
    });
}
    
function getTimeNow() {
    var timeVal = halfHourly(new Date())/1000;
    return timeVal;
}

//currently unused:
function generateKeyVal(locationObj) {
    var def = Q.defer();
    getPlaceName(locationObj.latitude, locationObj.longitude, function(err, res, data) {
        var timeInMillis = Date.now();
        key_val = hashids.encode(stringHash(route_ctry), timeInMillis);
        if (err) { def.reject(err); }
        else { def.resolve(key_val); }
    });
    return def.promise;
}

module.exports = {
    'getTimeNow': getTimeNow,
    'dateString': dateString
}