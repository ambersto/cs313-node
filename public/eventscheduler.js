function loadVenueList(){
	$.get("/getVenues", function(result) {
		if (result) {
			for (i in result){
				$("#venueList").append("<option value=\"" + result[i].id + "\">" + result[i].name + "</option>");
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
			$("#loginError").append("<span style=\"color: red;\">User id is: " + JSON.stringify(result) + "</li>");
			$("#loginError").append("<span style=\"color: red;\">User id is: " + JSON.stringify(result[0].id) + "</li>");
		} else {
			$("#loginError").text("Error logging in");
		}
	});
}

// TODO: autopopulate list of venues onLoad -> https://www.w3schools.com/tags/ev_onload.asp
//       https://www.w3schools.com/tags/tag_select.asp
//       https://stackoverflow.com/questions/8418811/is-there-a-way-to-use-javascript-to-populate-a-html-dropdown-menu-with-values

/*******************************************
 * Completed tasks
 ******************************************/
// TODO: page only shows result briefly, then it disappears... why?
// TODO: result is displayed as {object Object} even though query is correctly returning author id
