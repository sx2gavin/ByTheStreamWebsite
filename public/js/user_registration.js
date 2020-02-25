var userRegistration = function() {
	const userText = localStorage.getItem("user");
	if (userText && JSON.parse(userText).id) {
		return;
	}
	document.getElementById("registrationDialog").style.display = "block";
}

var submitEmptyUser = function(callback) {
	dispatchPOSTRequest(REST_NEW_USER, {}, function(response) {
		localStorage.setItem("user", response);
		callback();
	});
	document.getElementById("registrationDialog").style.display = "none";
}

var submitNewUser = function(callback) {
	const name = document.getElementById("newUserName").value;
	const email = document.getElementById("newUserEmail").value;
	const obj = {};
	if (!name && !email) return;
	if (name && name.trim() != '') {
		obj.name = name;
	}
	if (email && email.trim() != '') {
		obj.email = email;
	}
	dispatchPOSTRequest(REST_NEW_USER, obj, function(response) {
		localStorage.setItem("user", response);
		callback();
	});
	document.getElementById("registrationDialog").style.display = "none";
}