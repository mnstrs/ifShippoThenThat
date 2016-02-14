$('#shippoForm').submit(function(event){
	event.preventDefault();
	var tracking = $('#tracking').val();
	var carrier = $('#carrier').val();
	var data = {"tracking_number" : tracking, "carrier" :  carrier};
	var makerkey = $('#makerkey').val();

	$.ajax({
		type: "POST",
		url: "http://hackers-api.goshippo.com/v1/tracks/",
		headers: {
			"Authorization" : "ShippoToken 5123af17d668111ca5ab79517bc25e01988df1e2",
			"Content-type" : "application/json"
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function(response){
			var makerUser = {
				"key" : makerkey,
				"tracking_number" : tracking,
				"carrier" : carrier
			};

			var mongoUrl = "https://api.mongolab.com/api/1/databases/istt/collections/trackingKey?apiKey=M--cOAyDpsPcwUSEAs8QV_XcLP6mMsaZ"

			$.ajax({
			type: "POST",
			url: mongoUrl,
			data: JSON.stringify(makerUser),
			contentType: "application/json"
			});
		}
	});

});