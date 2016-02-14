var parallel    = require('async').parallel;
var MongoClient = require('mongodb').MongoClient;
var https = require('https');
var request = require('request');

var findTrackingKey = function(db, data, callback) {
	db.collection('trackingKey').find({
		tracking_number : data.tracking_number,
		carrier: data.carrier
	}, function(err, result) {
		if(err) callback(err);
		callback(result);
	});
};

var options = {
  method: "POST",
  body: {},
  json: true,
  url: ""
}

var callMaker = function(callback){
	console.log(options);
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			callback(response);
		} else{
			callback(error);
		}
	})
};

module.exports = function (ctx, done) {

	var mongoUrl = "mongodb://adolfosrs:mdb208154@ds059375.mongolab.com:59375/istt";

	MongoClient.connect(mongoUrl, function(err, db) {
		if(err) return done(err);

		findTrackingKey(db, ctx.data, function(results) {
			options.body =	{	value1 : ctx.data.tracking_number,
				value2 : ctx.data.tracking_status.status_details,
				value3 : ctx.data.tracking_status.location.city 
			};

			results.each(function(err, trackingKey){
				if (err) return done(err);
				if (trackingKey!=null){
					options.url = "https://maker.ifttt.com/trigger/"+ trackingKey.event_name +"/with/key/"+trackingKey.key;
					if (trackingKey.event_name == "track_updated" || (trackingKey.event_name == "track_delivered" && ctx.data.tracking_status.status == "DELIVERED")){
						callMaker(function(response){
							if (response.statusCode == 200){
								return done(null, 'SUCCESS - Maker Called');
							} else {
								return done(response);
							}
						});						
					} else {
						db.close();
						return done(null, "SUCCESS - No call needed");
					}
				}
			})
  		});


	});
}