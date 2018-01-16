

/* I like to write a main function so it feels like c/c++ style coding.*/
var main = function() {
	var simpleTraditionalChineseConverter = new SimpleToTraditionalConverter(); 

	var current_text_mode = 1 // simplified chinese characters.

	var convertButtonClicked = function() {

		var all_dom_elements = document.querySelectorAll("p, h1, h2, h3, h4, li");
		var convert_to = current_text_mode == 1?0:1;

		for (var i in all_dom_elements) {
			dom_element = all_dom_elements[i];
			var str = dom_element.innerHTML;
			dom_element.innerHTML = simpleTraditionalChineseConverter.transformString(str, convert_to);
		}

		current_text_mode = convert_to;

		// var description_header = document.getElementById("description");
		// var str = description_header.innerHTML;
		// 
		// description_header.innerHTML = simpleTraditionalChineseConverter.transformString(str, 0);
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
