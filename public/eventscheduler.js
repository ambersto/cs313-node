/********************************************
 * StartUp: sets the display on start-up
 *******************************************/
function startUp(){
	loadVenueList("#venueList");
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

function toggleEventDetails(eventId){
	var elementId = "event" + eventId;
	$(document.getElementById(elementId)).toggle();
}

/*******************************************
 * LoadVenueList: loads venues from database
 * into dropdown menu
 ******************************************/
function loadVenueList(listName){
	$(listName).empty();
	$.get("/getVenues", function(result) {
		if (result) {
			for (i in result){
				$(listName).append("<option value=\"" + JSON.stringify(result[i].id) + "\">" + JSON.stringify(result[i].venue_name) + "</option>");
			}
		} else {
			$(listName).append("<option>No venues available</option>")
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
			loadVenueList("#venueList");
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
						+ "onmouseover=\"toggleEventDetails(" + result[i].id + "); return false;\""
						+ "onmouseout=\"toggleEventDetails(" + result[i].id + "); return false;\">" 
						+ getHoursAndMinutes(newDate) + " - " + result[i].event_name 
						+ "   <button id=\"button" + result[i].id + "\" "
						+ "onclick=\"createEditEvent(" + result[i].id + "); return false;\">Edit Event</button>"
						+ "</li><p id=\"event" + result[i].id + "\"></p>");
					loadEventDetails(result[i].id);
					toggleEventDetails(result[i].id);
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

/*******************************************
 * LoadEventDetails: loads the details for a
 * specific event
 ******************************************/
function loadEventDetails(eventId){
	var eventParams = { eventId: eventId };
	var elementId = "event" + eventId;
	var venueId;
	$.get("/getEventDetails", eventParams, function(result) {
		if (result) {
			$(document.getElementById(elementId)).empty();
			$(document.getElementById(elementId)).append("Added by: " 
				+ result[0].first_name + "<br>"
				+ "Notes: " + result[0].notes + "<br>");
			venueId = result[0].venue_id;
			var venueParams = { venueId: venueId };
			$.get("/getVenueDetails", venueParams, function(result) {
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
		} else {
			$("#eventList").append("Error in event details");
		}
	});
}

/*******************************************
 * EmptyEventDetails: removes the details
 * from an event
 ******************************************/
function emptyEventDetails(eventId) {
	var elementId = "event" + eventId;
	$(document.getElementById(elementId)).empty();
}

/*******************************************
 * CreateEditEvent: creates input fields to
 * edit a specified event
 ******************************************/
function createEditEvent(eventId) {
	$("#eventList").empty();

	var eventParams = { eventId: eventId };
	$.get("/getEventDetails", eventParams, function(result) {
		if (result) {
			var tempDate = stringToDate(result[0].event_date);
			$("#editEventBox").append("<input type=\"text\" id=\"editEventName\""
				+ "value=\"" + result[0].event_name + "\"><br>");
			$("#editEventBox").append("<input type=\"datetime-local\" id=\"editEventDate\""
				+ "value=\"" + tempDate + "\><br>");
			$("#editEventBox").append("<textarea rows=\"4\" cols=\"50\" id=\"editNotes\">"
				+ result[0].notes + "</textarea><br>");
			$("#editEventBox").append("<select id=\"editVenueList\"></select><br>");
			loadVenueList("#editVenueList");
			$("#editEventBox").append("<button>Save changes</button>")
		} else {
			$("#eventList").append("Error in edit event");
		}
	});
}

// Edit inline? or remove list and display edit?
// Allow user to select which portion of the event
//   they would like to edit (Name, date, notes, venue)?
// Or prefill the inputs with default values and update
//   all fields?

// TODO: allow editing of event when clicked
// TODO: add style
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
// TODO: sort dates in ascending order
// TODO: query event list based on given date
// TODO: show details of event when clicked/hover?
