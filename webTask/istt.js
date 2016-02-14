var parallel    = require('async').parallel;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var https = require('https');
var request = require('request');

var findTrackingKey = function(db, data, callback) {
	db.collection('trackingKey').findOne({
		tracking_number : data.tracking_number,
		carrier: data.carrier
	}, function(err, result) {
		if(err) callback(err);
		callback(result);
	});
};

var options = {
  method: 'POST',
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

		findTrackingKey(db, ctx.data, function(result) {

			options.url = "https://maker.ifttt.com/trigger/track_updated/with/key/"+result.key;
			options.body =	{	value1 : ctx.data.tracking_number,
								value2 : ctx.data.tracking_status.status_details,
								value3 : ctx.data.tracking_status.location.city 
							};

			callMaker(function(response){
				if (response.statusCode == 200){
					return done(null, 'Success.');
				} else {
					return done(response);
				}
			});

			console.log(result);
			db.close();
  		});


	});
}