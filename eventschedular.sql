/**********************************************************
 * Create the database
 *********************************************************/
CREATE DATABASE eventscheduler;

/**********************************************************
 * Create tables
 *********************************************************/
CREATE TABLE venue
(
	id SERIAL PRIMARY KEY,
	venue_name VARCHAR(100) NOT NULL,
	street VARCHAR(100) NOT NULL,
	city VARCHAR(50) NOT NULL,
	state VARCHAR(50) NOT NULL,
	zip INT NOT NULL,
	phone VARCHAR(20),
	email VARCHAR(200)
);

CREATE TABLE author
(
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(100) NOT NULL
);

CREATE TABLE event
(
	id SERIAL PRIMARY KEY,
	event_name VARCHAR(100) NOT NULL,
	event_date TIMESTAMP NOT NULL,
	venue_id SMALLINT REFERENCES venue(id) NOT NULL,
	author_id SMALLINT REFERENCES author(id) NOT NULL,
	notes TEXT
);

/**********************************************************
 * Insert sample venue info
 *********************************************************/
INSERT INTO venue (
	venue_name,
	street,
	city,
	state,
	zip,
	phone
)
VALUES (
	'Brigham Young University-Idaho (BYUI)',
	'525 S Center St',
	'Rexburg',
	'Idaho',
	83460,
	'(208) 496-1411'
);

INSERT INTO venue (
	venue_name,
	street,
	city,
	state,
	zip
)
VALUES (
	'Red Brick Chapel',
	'166 S 1st E',
	'Rexburg',
	'Idaho',
	83440
);


/**********************************************************
 * Insert sample author info
 *********************************************************/
INSERT INTO author (first_name, last_name)
VALUES ('Amber', 'Stoddard');

INSERT INTO author (first_name, last_name)
VALUES ('Alyssa', 'Stoddard');

/**********************************************************
 * Insert sample event info
 *********************************************************/
INSERT INTO event (
	event_name,
	event_date,
	venue_id,
	author_id,
	notes
)
VALUES (
	'Commencement',
	'2018-07-23 04:00:00',
	(SELECT id FROM venue
	 WHERE venue_name='Brigham Young University-Idaho (BYUI)'),
	(SELECT id FROM author
	 WHERE first_name='Amber' AND last_name='Stoddard'),
	'Tickets required. Guests should be seated 30 minutes early.'
);

INSERT INTO event (
	event_name,
	event_date,
	venue_id,
	author_id,
	notes
)
VALUES (
	'From the Heart Fireside',
	'2018-07-08 19:00:00',
	(SELECT id FROM venue
	 WHERE venue_name='Red Brick Chapel'),
	(SELECT id FROM author
	 WHERE first_name='Alyssa' AND last_name='Stoddard'),
	'Invite friends!'
);

/**********************************************************
 * getUserId
 *********************************************************/
SELECT id FROM author
WHERE first_name = $1::VARCHAR AND last_name = $2::VARCHAR;

/**********************************************************
 * addUser
 *********************************************************/
INSERT INTO author (first_name, last_name)
VALUES ($1::VARCHAR, $2::VARCHAR);

/**********************************************************
 * addVenue -- return venue id (last insert id) -- Use result.insertId
 *********************************************************/
INSERT INTO venue (venue_name, street, city, state, zip, phone, email)
VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::INT, $6::VARCHAR, $7::VARCHAR);

/**********************************************************
 * addEvent
 *********************************************************/
INSERT INTO event (event_name, event_date, venue_id, author_id, notes)
VALUES ($1::VARCHAR, $2::TIMESTAMP, $3::INT, $4::INT, $5::TEXT);

/**********************************************************
 * getEvents
 *********************************************************/
SELECT 
e.id,
e.event_name,
e.event_date,
v.venue_name,
a.first_name,
e.notes
FROM event e INNER JOIN venue v ON e.venue_id=v.id
INNER JOIN author a ON e.author_id=a.id;

/**********************************************************
 * getDay
 *********************************************************/
SELECT 
e.id,
e.event_name,
e.event_date,
v.venue_name,
a.first_name,
e.notes
FROM event e INNER JOIN venue v ON e.venue_id=v.id
INNER JOIN author a ON e.author_id=a.id
WHERE e.event_date BETWEEN $1::TIMESTAMP AND $2::TIMESTAMP;

/**********************************************************
 * getEventDetails
 *********************************************************/
SELECT e.id,
e.event_name,
e.event_date,
v.venue_name,
a.first_name,
e.notes
FROM event e INNER JOIN venue v ON e.venue_id=v.id
INNER JOIN author a ON e.author_id=a.id 
WHERE e.id = $1::INT;

/**********************************************************
 * getVenueDetails
 *********************************************************/
SELECT * FROM venue WHERE id = $1::INT;

/**********************************************************
 * getVenues
 *********************************************************/
SELECT id, venue_name FROM venue;

/**********************************************************
 * getUserDetails
 *********************************************************/
SELECT * FROM author WHERE id = $1::INT;

/**********************************************************
 * updateVenue
 *********************************************************/
UPDATE venue
SET venue_name = $1::VARCHAR,
	street = $2::VARCHAR,
	city = $3::VARCHAR,
	state = $4::VARCHAR,
	zip = $5::INT,
	phone = $6::VARCHAR,
	email = $7::VARCHAR
WHERE id = $8::INT;

/**********************************************************
 * updateEvent
 *********************************************************/
UPDATE event
SET event_name = $1::VARCHAR,
	event_date = $2::TIMESTAMP,
	venue_id = $3::INT,
	author_id = $4::INT,
	notes = $5::TEXT
WHERE id = $6::INT;



