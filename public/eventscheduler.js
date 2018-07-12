function login(){
	var firstname = $("#firstname").val();
	var lastname = $("#lastname").val();
	
	var params = {
		firstname: firstname,
		lastname: lastname
	};

	$.get("/getUserId", params, function(result) {
		if (result) {
			$("#events").text("User id is: " + result);
		} else {
			$("#events").text("Error logging in");
		}
	});
}

// TODO: page only shows result briefly, then it disappears... why?
// TODO: result is displayed as {object Object} even though query is correctly returning author id