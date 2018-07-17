var express = require('express');
var app = express();

// postgres data connection module
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://eventuser:di2sd3kfnl@localhost:5432/eventscheduler";
const pool = new Pool({connectionString: connectionString});

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var session = require('express-session')

// set up sessions
app.use(session({
  secret: 'my-super-secret-secret!',
  resave: false,
  saveUninitialized: true
}))

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


app.get('/getUserId', function(request, response) {
	getUserId(request, response);
});
app.post('/addUser', function(request, response) {
	addUser(request, response);
});
app.post('/addVenue', function(request, response) {
	addVenue(request, response);
});
app.post('/addEvent', function(request, response) {
	addEvent(request, response);
});
app.get('/getEvents', function(request, response) {
	getEvents(request, response);
});
app.get('/getDay', function(request, response) {
	getDay(request, response);
});
app.get('/getEventDetails', function(request, response) {
	getEventDetails(request, response);
});
app.get('/getVenueDetails', function(request, response) {
	getVenueDetails(request, response);
});
app.get('/getVenues', function(request, response) {
	getVenues(request, response);
});
app.get('/getUserDetails', function(request, response) {
	getUserDetails(request, response);
});
app.patch('/updateVenue', function(request, response) {
	updateVenue(request, response);
});
app.patch('/updateEvent', function(request, response) {
	updateEvent(request, response);
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
	getUserIdFromDB(firstname, lastname, function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		request.session.userId = result[0].id;
		console.log("Session user ID: " + request.session.userId);
		response.status(200).json(result);
	}
});
}

// add a new user
function addUser(request, response) {
	var firstname = request.body.firstname;
	var lastname = request.body.lastname;
	console.log("Adding new user");
	addUserToDB(firstname, lastname, function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

// add a new venue
function addVenue(request, response) {
	var venueName = request.body.venueName;
	var street = request.body.street;
	var city = request.body.city;
	var state = request.body.state;
	var zip = request.body.zip;
	var phone = request.body.phone;
	var email = request.body.email;
	console.log("Adding new venue");
	addVenueToDB(venueName, street, city, state, zip, phone, email, function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

// add a new event
function addEvent(request, response) {
	var eventName = request.body.eventName;
	var eventDate = request.body.eventDate;
	var venueId = request.body.venueId;
	var authorId = request.session.userId;
	var notes = request.body.notes;
	console.log("Adding new event");
	addEventToDB(eventName, eventDate, venueId, authorId, notes, function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

// get list of all events
function getEvents(request, response) {
	console.log("Retrieving all events");
	getEventsFromDB(function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

// get events from specified day
function getDay(request, response) {
	var dayStart = request.query.dayStart;
	var dayEnd = request.query.dayEnd;
	console.log("Retrieving event for specified day");
	getEventsFromDB(dayStart, dayEnd, function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

// get event details
function getEventDetails(request, response) {
	var eventId = request.query.eventId;
	console.log("Retrieving details for event");
	getEventDetails(eventId, function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

// get venue details
function getVenueDetails(request, response) {
	var venueId = request.query.venueId;
	console.log("Retrieving details for venue");
	getEventDetails(venueId, function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

// get list of all venues
function getVenues(request, response) {
	console.log("Retrieving all events");
	getVenuesFromDB(function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

// get user details
function getUserDetails(request, response) {
	var userId = request.query.userId;
	console.log("Retrieving details for user");
	getUserDetailsFromDB(userId, function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

// update a venue
function updateVenue(request, response) {
	var venueId = request.body.venueId;
	var venueName = request.body.venueName;
	var street = request.body.street;
	var city = request.body.city;
	var state = request.body.state;
	var zip = request.body.zip;
	var phone = request.body.phone;
	var email = request.body.email;
	console.log("Updating venue");
	updateVenueInDB(venueId, venueName, street, city, state, zip, phone, email, function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

// update an event
function updateEvent(request, response) {
	var eventId = request.body.eventId;
	var eventName = request.body.eventName;
	var eventDate = request.body.eventDate;
	var venueId = request.body.venueId;
	var authorId = request.session.userId;
	var notes = request.body.notes;
	console.log("Updating event");
	updateEventInDB(eventId, eventName, eventDate, venueId, authorId, notes, function (error, result) {
	if(error || result == null) {
		response.status(500).json({success: false, data: error});
	} else {
		response.status(200).json(result);
	}
});
}

/********************************************************
 * Functions for DB queries
 *******************************************************/
// get user id
function getUserIdFromDB(firstname, lastname, callback) {
	console.log("Getting user ID from DB with firstname: " + firstname + " and lastname: " + lastname);
	var sql = "SELECT id FROM author WHERE first_name = $1::VARCHAR AND last_name = $2::VARCHAR";
	var params = [firstname, lastname];
	pool.query(sql, params, function(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	console.log("Found result: " + JSON.stringify(result.rows));
	callback(null, result.rows);
});
}

// insert new user
function addUserToDB(firstname, lastname, callback) {
	console.log("Adding user to DB");
	var sql = "INSERT INTO author (first_name, last_name) VALUES ($1::VARCHAR, $2::VARCHAR)";
	var params = [firstname, lastname];
	pool.query(sql, params, function(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	// TODO: test this line
	console.log("Inserted row with ID:  " + JSON.stringify(result.insertId));
	callback(null, result.rows);
});
}

// insert new venue
function addVenueToDB(venueName, street, city, state, zip, phone, email, callback) {
	console.log("Adding venue to DB");
	var sql = "INSERT INTO venue (venue_name, street, city, state, zip, phone, email) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::INT, $6::VARCHAR, $7::VARCHAR)";
	var params = [venueName, street, city, state, zip, phone, email];
	pool.query(sql, params, function(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	// TODO: test this line
	console.log("Inserted row with ID:  " + JSON.stringify(result.insertId));
	callback(null, result.rows);
});
}

// insert new event
function addEventToDB(eventName, eventDate, venueId, authorId, notes, callback) {
	console.log("Adding event to DB");
	var sql = "INSERT INTO event (event_name, event_date, venue_id, author_id, notes) VALUES ($1::VARCHAR, $2::TIMESTAMP, $3::INT, $4::INT, $5::TEXT)";
	var params = [eventName, eventDate, venueId, authorId, notes];
	pool.query(sql, params, function(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	// TODO: test this line
	console.log("Inserted row with ID:  " + JSON.stringify(result.insertId));
	callback(null, result.rows);
});
}

// get list of all events
function getEventsFromDB(callback) {
	console.log("Getting events from DB");
	var sql = "SELECT e.id, e.event_name AS event_name, e.event_date AS event_date, v.venue_name, a.first_name, e.notes FROM event e INNER JOIN venue v ON e.venue_id=v.id INNER JOIN author a ON e.author_id=a.id";
	pool.query(sql, function(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	console.log("Found result: " + JSON.stringify(result.rows));
	callback(null, result.rows);
});
}

// get events for a specific day
function getDayFromDB(dayStart, dayEnd, callback) {
	console.log("Getting events for a specific day from DB");
	var sql = "SELECT e.id, e.event_name, e.event_date, v.venue_name, a.first_name, e.notes FROM event e INNER JOIN venue v ON e.venue_id=v.id INNER JOIN author a ON e.author_id=a.id WHERE e.event_date = $1::TIMESTAMP";
	var params = [dayStart, dayEnd];
	pool.query(sql, params, function(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	console.log("Found result: " + JSON.stringify(result.rows));
	callback(null, result.rows);
});
}

// get details for an event
function getEventDetailsFromDB(eventId, callback) {
	console.log("Getting details for an event from DB");
	var sql = "SELECT e.id, e.event_name, e.event_date, v.venue_name, a.first_name, e.notes FROM event e INNER JOIN venue v ON e.venue_id=v.id INNER JOIN author a ON e.author_id=a.id WHERE e.id = $1::INT";
	var params = [eventId];
	pool.query(sql, params, function(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	console.log("Found result: " + JSON.stringify(result.rows));
	callback(null, result.rows);
});
}

// get details for a venue
function getVenueDetailsFromDB(venueId, callback) {
	console.log("Getting details for a venue from DB");
	var sql = "SELECT * FROM venue WHERE id = $1::INT";
	var params = [venueId];
	pool.query(sql, params, function(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	console.log("Found result: " + JSON.stringify(result.rows));
	callback(null, result.rows);
});
}

// get list of all venues
function getVenuesFromDB(callback) {
	console.log("Getting venues from DB");
	var sql = "SELECT id, venue_name FROM venue";
	pool.query(sql, function(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	console.log("Found result: " + JSON.stringify(result.rows));
	callback(null, result.rows);
});
}

// get details for a user
function getUserDetailsFromDB(userId, callback) {
	console.log("Getting details for a user from DB");
	var sql = "SELECT * FROM author WHERE id = $1::INT";
	var params = [userId];
	pool.query(sql, params, function(err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	console.log("Found result: " + JSON.stringify(result.rows));
	callback(null, result.rows);
});
}

// update a venue
function updateVenueInDB(venueId, venueName, street, city, state, zip, phone, email, callback) {
	console.log("Updating venue in DB");
	var sql = "UPDATE venue SET venue_name = $1::VARCHAR, street = $2::VARCHAR, city = $3::VARCHAR, state = $4::VARCHAR, zip = $5::INT, phone = $6::VARCHAR, email = $7::VARCHAR WHERE id = $8::INT";
	var params = [venueName, street, city, state, zip, phone, email, venueId];
	pool.query(sql, params, function (err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	// TODO: test this line
	console.log("Updated row with ID:  " + JSON.stringify(result.insertId));
	callback(null, result.rows);
});
}

// update an event
function updateEventInDB(eventId, eventName, eventDate, venueId, authorId, notes, callback) {
	console.log("Updating event in DB");
	var sql = "UPDATE event SET event_name = $1::VARCHAR, event_date = $2::TIMESTAMP, venue_id = $3::INT, author_id = $4::INT, notes = $5::TEXT WHERE id = $6::INT";
	var params = [eventName, eventDate, venueId, authorId, notes, eventId];
	pool.query(sql, params, function (err, result) {
	if (err) {
		console.log("Error in query: ");
		console.log(err);
		callback(err, null);
	}
	// TODO: test this line
	console.log("Updated row with ID:  " + JSON.stringify(result.insertId));
	callback(null, result.rows);
});
}
