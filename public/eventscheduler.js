function loadVenueList(){
	$("#venueList").empty();
	$.get("/getVenues", function(result) {
		if (result) {
			for (i in result){
				$("#venueList").append("<option value=\"" + JSON.stringify(result[i].id) + "\">" + JSON.stringify(result[i].venue_name) + "</option>");
			}
		} else {
			$("#venueList").append("<option>No venues available</option>")
		}
	});
}

function login(){
	var firstname = $("#firstname").val();
	var lastname = $("#lastname").val();
	
	var params = {
		firstname: firstname,
		lastname: lastname
	};

	$.get("/getUserId", params, function(result) {
		if (result) {
			// If user has not been created, make one
			if(JSON.stringify(result) == "[]"){
				$.post("/addUser", params, function(result) {
					if(result) {
						// Once a new user is created, log them out
						login();
					} else {
						$("#loginError").text("Error logging in");
					}
				});
			} else {
				// Debugging statement - display the user's id when they log in
				$("#loginError").text("<span style=\"color: red;\">User id is: " + JSON.stringify(result[0].id) + "</span>");
			}
		} else {
			$("#loginError").text("Error logging in");
		}
	});
}

function addVenue(){
	var venueName = $("#venueName").val();
	var street = $("#street").val();
	var city = $("#city").val();
	var state = $("#state").val();
	var zip = $("#zip").val();
	var phone = $("#phone").val();
	var email = $("#email").val();

	var params = {
		venueName: venueName,
		street: street,
		city: city,
		state: state,
		zip: zip,
		phone: phone,
		email: email
	};

	$.post("/addVenue", params, function(result) {
		if (result) {
			console.log("Venue added");
			loadVenueList();
		} else {
			console.log("Error adding venue");
		}
	});
}

function addEvent(){
	login();
	/*var eventName = $("#eventName").val();
	var eventDate = $("#eventDate").val();
	var venueId = $("#venueList").val();
	var notes = $("#notes").val();

	var params = {
		eventName: eventName,
		eventDate: eventDate,
		venueId: venueId,
		notes: notes
	};

	/*$.post("/addEvent", params, function(result) {
		if(result) {
			console.log("Event added");
		} else {
			console.log("Error adding event");
		}
	});*/
}


/*******************************************
 * Completed tasks
 ******************************************/
// TODO: page only shows result briefly, then it disappears... why?
// TODO: result is displayed as {object Object} even though query is correctly returning author id
// TODO: autopopulate list of venues onLoad -> https://www.w3schools.com/tags/ev_onload.asp
//       https://www.w3schools.com/tags/tag_select.asp
//       https://stackoverflow.com/questions/8418811/is-there-a-way-to-use-javascript-to-populate-a-html-dropdown-menu-with-values
//		 https://stackoverflow.com/questions/10578619/jquery-dynamically-create-select-tag/10579053
