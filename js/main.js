

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


window.onload = main;
