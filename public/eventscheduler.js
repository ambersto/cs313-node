/********************************************
 * StartUp: sets the display on start-up
 *******************************************/
function startUp(){
	loadVenueList();
	$("#addEventBox").hide();
	$("#addVenueBox").hide();
	$("#createNewEvent").hide();
	$("#displayEvents").hide();
	$("#displayBox").hide();
}

/*******************************************
 * Toggle functions: toggle the displays
 ******************************************/
function toggleLoginBox() {
	$("#loginBox").toggle();	
}

function toggleEventBox() {
	$("#addEventBox").toggle();
	toggleEventButton();
}

function toggleEventButton() {
	$("#createNewEvent").toggle();
}

function toggleVenueBox() {
	$("#addVenueBox").toggle();
	toggleVenueButton();
}

function toggleVenueButton() {
	$("#createNewVenue").toggle();
}

function toggleDisplayBox() {
	$("#displayBox").toggle();
}

function toggleDisplayButton() {
	$("#displayEvents").toggle();
}

/*******************************************
 * LoadVenueList: loads venues from database
 * into dropdown menu
 ******************************************/
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

/*******************************************
 * Login: logs the user in (creates new user
 * if they are not in the database) and 
 * changes the display
 ******************************************/
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
						// Once a new user is created, log them in
						login();
					} else {
						$("#loginError").text("Error logging in");
					}
				});
			} else {
				// After login, hide login elements and display options
				toggleLoginBox(); // Hide login box
				toggleEventButton(); // Show event button
				toggleDisplayButton(); // Show display button
				
				// Debugging statement - display the user's id when they log in
				//$("#loginError").text("User id is: " + JSON.stringify(result[0].id));
			}
		} else {
			$("#loginError").text("Error logging in");
		}
	});
}

/*******************************************
 * AddVenue: adds a new venue to the database
 ******************************************/
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
	toggleVenueBox();
}

/*******************************************
 * AddEvent: adds a new event to the database
 ******************************************/
function addEvent(){
	var eventName = $("#eventName").val();
	var eventDate = $("#eventDate").val();
	var venueId = $("#venueList").val();
	var notes = $("#notes").val();

	var params = {
		eventName: eventName,
		eventDate: eventDate,
		venueId: venueId,
		notes: notes
	};
	$("#events").text("Adding event now");

	$.post("/addEvent", params, function(result) {
		if(result) {
			console.log("Event added");
		} else {
			console.log("Error adding event");
		}
	});
	$("#events").text("database connection is working");
	loadEventList();
}

/*******************************************
 * LoadEventList: loads events from database
 ******************************************/
 function loadEventList() {
	if(!$("#addEventBox").is(":hidden")){
		toggleEventBox();
	}
	if($("#displayBox").is(":hidden")){
		$.get("/getEvents", function(result) {
			if (result) {
				console.log("Showing events");
				$("#eventList").empty();
				for (i in result){
					var newDate = stringToDate(result[i].event_date);
					$("#eventList").append("<li name=\"" + result[i].id + "\">" + newDate.getHours() + ":" + newDate.getMinutes() + " - " + result[i].event_name + "</li>");
				}
			} else {
				console.log("Error loading events");
			}
		});
	}
	toggleDisplayBox();
}

/*******************************************
 * StringToDate: converts sql timestamp to js date
 ******************************************/
function stringToDate(dateString) {
	var dateArray = dateString.split(/[: T . Z -]/);
	var newDate = new Date(dateArray[0], dateArray[1], dateArray[2], dateArray[3], dateArray[4], dateArray[5], dateArray[6]);
	return newDate;
}

// TODO: query event list based on given date
// TODO: show details of event when clicked/hover?
// TODO: allow editing of event when clicked
// ?? TODO: allow deleting of event

/*******************************************
 * Completed tasks
 ******************************************/
// TODO: page only shows result briefly, then it disappears... why?
// TODO: result is displayed as {object Object} even though query is correctly returning author id
// TODO: autopopulate list of venues onLoad -> https://www.w3schools.com/tags/ev_onload.asp
//       https://www.w3schools.com/tags/tag_select.asp
//       https://stackoverflow.com/questions/8418811/is-there-a-way-to-use-javascript-to-populate-a-html-dropdown-menu-with-values
//		 https://stackoverflow.com/questions/10578619/jquery-dynamically-create-select-tag/10579053
// TODO: display list of event names and times
// TODO: fix display of dates
