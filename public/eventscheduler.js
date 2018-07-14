function loadVenueList(){
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
			if(JSON.stringify(result) == "[]"){
				$("#loginError").append("<span style=\"color: blue;\">No id found</span>");				
			} else {
				$("#loginError").append("<span style=\"color: red;\">User id is: " + JSON.stringify(result[0].id) + "</span>");
			}
		} else {
			$("#loginError").text("Error logging in");
		}
	});
}

function addUser(){
	var firstname = $("#firstname").val();
	var lastname = $("#lastname").val();
	
	var params = {
		firstname: firstname,
		lastname: lastname
	};

	$.post("/addUser", params, function(result) {
		if(result) {
			$("#loginError").append("<span style=\"color: red;\">New user added</span>");
		} else {
			$("#loginError").text("Error logging in");
		}
	});
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
