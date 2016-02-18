$('#shippoForm').submit(function(event){
	event.preventDefault();
	var tracking = $('#tracking').val();
	var carrier = $('#carrier option:selected').val();
	var data = {"tracking_number" : tracking, "carrier" :  carrier};
	var makerkey = $('#makerkey').val();
	var event_name = $('#event option:selected').val();

    $('.step').removeClass('current');
    $('.finalPage').removeClass('hidden').addClass('here');
    
    
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
				"carrier" : carrier,
				"event_name" : event_name
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

$('.nextStep').on('click', function(e){    
    
    var section = $(this).parents('.current');
    var field = section.find('input');
    
    field.next('span').remove();
    
    if((field.length && field.val()) || (!field.length)){
        section.removeClass('current').addClass('gone');
        section.next('.step').addClass('current');
    }
    
    else {
       field.after('<span>You to need fill this field</span>');
    }
    
    
    e.preventDefault();
});

setTimeout(function(){
  $('html').removeClass('loading').addClass('loaded');
}, 1200);
