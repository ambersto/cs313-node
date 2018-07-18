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
 * ShowEvents: displays the event section
 ******************************************/
function showEvents() {
	if(!$("#addEventBox").is(":hidden")){
		toggleEventBox();
	}
	toggleDisplayBox();
}

/*******************************************
 * LoadEventList: loads events from database
 ******************************************/
 function loadEventList() {
 	var selectedDate = new Date($("#selectedDate").val());
 	$.get("/getEvents", function(result) {
		if (result) {
			console.log("Showing events");
			$("#eventList").empty();
			for (i in result){
				var newDate = stringToDate(result[i].event_date);
				if(newDate.getFullYear() == selectedDate.getFullYear()
					&& newDate.getMonth() == (selectedDate.getMonth() + 1)
					&& newDate.getDate() == (selectedDate.getDate() + 1)) {
					$("#eventList").append("<li "
						+ "onmouseover=\"loadEventDetails(" + result[i].id + "); return false;\">" 
						+ getHoursAndMinutes(newDate) + " - " + result[i].event_name 
						+ "</li><p id=\"event" + result[i].id + "\"></p>");
				}
			}
		} else {
			console.log("Error loading events");
		}
	});
}

/*******************************************
 * StringToDate: converts sql timestamp to js date
 ******************************************/
function stringToDate(dateString) {
	var dateArray = dateString.split(/[: T . Z -]/);
	var newDate = new Date(dateArray[0], dateArray[1], dateArray[2], dateArray[3], dateArray[4], dateArray[5], dateArray[6]);
	return newDate;
}

/*******************************************
 * GetHoursAndMinutes: extracts and formats
 * hours and minutes from date
 ******************************************/
function getHoursAndMinutes(longDate) {
	var timeString = "";
	var period = "";
	if(longDate.getHours() > 12){
		timeString += (longDate.getHours() - 12) + ":";
		period += "PM";
	} else if(longDate.getHours() == 12) {
		timeString += longDate.getHours() + ":";
		period += "PM";
	} else{
		timeString += longDate.getHours() + ":";
		period += "AM";
	}
	
	if(longDate.getMinutes() < 10){
		timeString += "0" + longDate.getMinutes() + " " + period;
	} else {
		timeString += longDate.getMinutes() + " " + period;
	}

	return timeString;
}

function loadEventDetails(eventId){
	var eventParams = { eventId: eventId };
	var elementId = "event" + eventId;
	var venueId;
	$.get("/getEventDetails", eventParams, function(result) {
		if (result) {
			$(document.getElementById(elementId)).empty();
			$(document.getElementById(elementId)).append("<br>Added by: " 
				+ result[0].first_name + "<br>"
				+ "Notes: " + result[0].notes + "<br>");
			venueId = result[0].venue_id;
		} else {
			$("#eventList").append("Error in event details");
		}
	});

	var venueParams = { venueId: venueId };
	$.get("/getEventDetails", eventParams, function(result) {
		if (result) {
			$(document.getElementById(elementId)).append("Location: <br>" 
				+ result[0].venue_name + "<br>"
				+ result[0].street + "<br>"
				+ result[0].city + ", " + result[0].state 
				+ " " + result[0].zip + "<br>"
				+ "Phone: " + result[0].phone + "<br>"
				+ "Email: " + result[0].email + "<br>");
		} else {
			$("#eventList").append("Error in venue details");
		}
	});
}

// TODO: show details of event when clicked/hover?
// TODO: allow editing of event when clicked
// ?? TODO: allow deleting of event
// TODO: add style

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
// TODO: sort dates in ascending order
// TODO: query event list based on given date
