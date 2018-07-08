var express = require('express');
var app = express();

// postgres data connection module
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://eventuser:di2sd3kfnl@localhost:5432/eventscheduler";
const pool = new Pool({connectionString: connectionString});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Returns list of all events
app.get('/getEvents', function(request, response) {
	getEvents(request, response);
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


/********************************************************
 * Controller functions for requests
 *******************************************************/
// get a user id
function getUserId(request, response) {
	var firstname = request.query.firstname;
	var lastname = request.query.lastname;
	console.log("Retrieving user id");
	getUserIdFromDB(firstname, lastname, requestCallback)	
}

// add a new user
function addUser(request, response) {
	var firstname = request.query.firstname;
	var lastname = request.query.lastname;
	console.log("Adding new user");
	addUserToDB(firstname, lastname, requestCallback);
}

// add a new venue
function addVenue(request, response) {
	var venueName = request.query.venueName;
	var street = request.query.street;
	var city = request.query.city;
	var state = request.query.state;
	var zip = request.query.zip;
	var phone = request.query.phone;
	var email = request.query.email;
	console.log("Adding new venue");
	addVenueToDB(venueName, street, city, state, zip, phone, email, requestCallback);
}

// add a new event
function addEvent(request, response) {
	var eventName = request.query.eventName;
	var eventDate = request.query.eventDate;
	var venueId = request.query.venueId;
	var authorId = request.query.authorId;
	var notes = request.query.notes;
	console.log("Adding new event");
	addEventToDB(eventName, eventDate, venueId, authorId, notes, requestCallback);
}

// get list of all events
function getEvents(request, response) {
	console.log("Retrieving all events");
	getEventsFromDB(requestCallback);
}

// get events from specified day
function getDay(request, response) {
	var dayStart = request.query.dayStart;
	var dayEnd = request.query.dayEnd;
	console.log("Retrieving event for specified day");
	getEventsFromDB(dayStart, dayEnd, requestCallback);
}

// get event details
function getEventDetails(request, response) {
	var eventId = request.query.eventId;
	console.log("Retrieving details for event");
	getEventDetails(eventId, requestCallback);
}

// get venue details
function getVenueDetails(request, response) {
	var venueId = request.query.venueId;
	console.log("Retrieving details for venue");
	getEventDetails(venueId, requestCallback);
}

// get list of all venues
function getVenues(request, response) {
	console.log("Retrieving all events");
	getVenuesFromDB(requestCallback);
}

// get user details
function getUserDetails(request, response) {
	var userId = request.query.userId;
	console.log("Retrieving details for user");
	getEventDetails(userId, requestCallback);
}

// update a venue
function updateVenue(request, response) {\
	var venueId = request.query.venueId;
	var venueName = request.query.venueName;
	var street = request.query.street;
	var city = request.query.city;
	var state = request.query.state;
	var zip = request.query.zip;
	var phone = request.query.phone;
	var email = request.query.email;
	console.log("Updating venue");
	updateVenueInDB(venueId, venueName, street, city, state, zip, phone, email, requestCallback);
}

// update an event
function updateEvent(request, response) {
	var eventId = request.query.eventId;
	var eventName = request.query.eventName;
	var eventDate = request.query.eventDate;
	var venueId = request.query.venueId;
	var authorId = request.query.authorId;
	var notes = request.query.notes;
	console.log("Updating event");
	updateEventInDB(eventId, eventName, eventDate, venueId, authorId, notes, requestCallback);
}

/********************************************************
 * Callback function for requests
 *******************************************************/
function requestCallback(error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
}

/********************************************************
 * Functions for DB queries
 *******************************************************/
// get user id
function getUserIdFromDB(firstname, lastname, callback) {
	console.log("Getting user ID from DB");
	var sql = "SELECT id FROM author WHERE first_name = $1::VARCHAR AND last_name = $2::VARCHAR";
	var params = [firstname, lastname];
	pool.query(sql, params, selectCallback);
}

// insert new user
function addUserToDB(firstname, lastname, callback) {
	console.log("Adding user to DB");
	var sql = "INSERT INTO author (first_name, last_name) VALUES ($1::VARCHAR, $2::VARCHAR)";
	var params = [firstname, lastname];
	pool.query(sql, params, insertCallback);
}

// insert new venue
function addVenueToDB(venueName, street, city, state, zip, phone, email, callback) {
	console.log("Adding venue to DB");
	var sql = "INSERT INTO venue (venue_name, street, city, state, zip, phone, email) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::INT, $6::VARCHAR, $7::VARCHAR)";
	var params = [venueName, street, city, state, zip, phone, email];
	pool.query(sql, params, insertCallback);
}

// insert new event
function addEventToDB(eventName, eventDate, venueId, authorId, notes, callback) {
	console.log("Adding event to DB");
	var sql = "INSERT INTO event (event_name, event_date, venue_id, author_id, notes) VALUES ($1::VARCHAR, $2::TIMESTAMP, $3::INT, $4::INT, $5::TEXT)";
	var params = [eventName, eventDate, venueId, authorId, notes];
	pool.query(sql, params, insertCallback);
}

// get list of all events
function getEventsFromDB(callback) {
	console.log("Getting events from DB");
	var sql = "SELECT e.id, e.event_name, e.event_date, v.venue_name, a.first_name, e.notes FROM event e INNER JOIN venue v ON e.venue_id=v.id INNER JOIN author a ON e.author_id=a.id";
	pool.query(sql, selectCallback);
}

// get events for a specific day
function getDayFromDB(dayStart, dayEnd, callback) {
	console.log("Getting events for a specific day from DB");
	var sql = "SELECT e.id, e.event_name, e.event_date, v.venue_name, a.first_name, e.notes FROM event e INNER JOIN venue v ON e.venue_id=v.id INNER JOIN author a ON e.author_id=a.id WHERE e.event_date = $1::TIMESTAMP";
	var params = [dayStart, dayEnd];
	pool.query(sql, params, selectCallback);
}

// get details for an event
function getEventDetailsFromDB(eventId, callback) {
	console.log("Getting details for an event from DB");
	var sql = "SELECT e.id, e.event_name, e.event_date, v.venue_name, a.first_name, e.notes FROM event e INNER JOIN venue v ON e.venue_id=v.id INNER JOIN author a ON e.author_id=a.id WHERE e.id = $1::INT";
	var params = [eventId];
	pool.query(sql, params, selectCallback);
}

// get details for a venue
function getVenueDetailsFromDB(venueId, callback) {
	console.log("Getting details for a venue from DB");
	var sql = "SELECT * FROM venue WHERE id = $1::INT";
	var params = [venueId];
	pool.query(sql, params, selectCallback);
}

// get list of all venues
function getVenuesFromDB(callback) {
	console.log("Getting venues from DB");
	var sql = "SELECT id, venue_name FROM venue";
	pool.query(sql, selectCallback);
}

// get details for a user
function getUserDetailsFromDB(userId, callback) {
	console.log("Getting details for a user from DB");
	var sql = "SELECT * FROM author WHERE id = $1::INT";
	var params = [userId];
	pool.query(sql, params, selectCallback);
}

// update a venue
function updateVenueInDB(venueId, venueName, street, city, state, zip, phone, email, callback) {
	console.log("Updating venue in DB");
	var sql = "UPDATE venue SET venue_name = $1::VARCHAR, street = $2::VARCHAR, city = $3::VARCHAR, state = $4::VARCHAR, zip = $5::INT, phone = $6::VARCHAR, email = $7::VARCHAR WHERE id = $8::INT";
	var params = [venueName, street, city, state, zip, phone, email, venueId];
	pool.query(sql, params, updateCallback);
}

// update an event
function updateEventInDB(eventId, eventName, eventDate, venueId, authorId, notes, callback) {
	console.log("Updating event in DB");
	var sql = "UPDATE event SET event_name = $1::VARCHAR, event_date = $2::TIMESTAMP, venue_id = $3::INT, author_id = $4::INT, notes = $5::TEXT WHERE id = $6::INT";
	var params = [eventName, eventDate, venueId, authorId, notes, eventId];
	pool.query(sql, params, updateCallback);
}


/****************************************************
 * Callback functions for DB queries
 ***************************************************/
// Callback function for all inserts
function insertCallback(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	// TODO: test this line
	console.log("Inserted row with ID:  " + JSON.stringify(result.insertId));
	callback(null, result.rows);
}

// Callback function for all select queries
function selectCallback(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	console.log("Found result: " + JSON.stringify(result.rows));
	callback(null, result.rows);
}

// Callback function for all updates
function updateCallback(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	// TODO: test this line
	console.log("Updated row with ID:  " + JSON.stringify(result.insertId));
	callback(null, result.rows);
}