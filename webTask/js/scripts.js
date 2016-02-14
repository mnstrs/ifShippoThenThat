$('#shippoForm').submit(function(event){
	event.preventDefault();
	data = {"tracking_number" : $('#tracking').val(), "carrier" :  $('#carrier').val()};

	$.ajax({
		type: "POST",
		url: "http://hackers-api.goshippo.com/v1/tracks/",
		headers: {
			"Authorization" : "ShippoToken 0df5964d09a9e09f6d40f29ec3b45ff8da3804e3",
			"Content-type" : "application/json"
		},
		contentType: 'application/json',
		data: JSON.stringify(data)	
	});
});