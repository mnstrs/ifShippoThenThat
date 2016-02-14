var parallel    = require('async').parallel;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var findTrackingKey = function(db, data, callback) {
	db.collection('trackingKey').findOne({
		tracking_number : data.tracking_number,
		carrier: data.carrier
	}, function(err, result) {
		if(err) callback(err);
		callback(result);
	});
};

module.exports = function (ctx, done) {

	var mongoUrl = "mongodb://adolfosrs:mdb208154@ds059375.mongolab.com:59375/istt";

	MongoClient.connect(mongoUrl, function(err, db) {
		if(err) return done(err);

		findTrackingKey(db, ctx.data, function(result) {
			if(err) return done(err);

			var makerUrl = "https://maker.ifttt.com/trigger/track_updated/with/key/"+result.key;


			console.log(result);
			db.close();
  		});

  		done(null, 'Success.');
	});
}