

/* I like to write a main function so it feels like c/c++ style coding.*/
var main = function() {
	var simpleTraditionalChineseConverter = new SimpleToTraditionalConverter(); 

	var convertButtonClicked = function() {

		var description_header = document.getElementById("description");
		var str = description_header.innerHTML;

		description_header.innerHTML = simpleTraditionalChineseConverter.transformString(str, 0);
	}

	var convert_button = document.getElementById("convert-button");
	convert_button.onclick = convertButtonClicked;

	pageInit(); // each page has it's own version of pageInit() function.
}

var loadLocalJSON = function(callback, path) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', path, true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	}
	xobj.send(null);
}


window.onload = main;
