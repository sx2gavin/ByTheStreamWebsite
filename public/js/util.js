var loadJSON = function(path, callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', path, true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	}
	xobj.send();
}

// Create a new DOM element from the document.
//   _tag - tag of the DOM element. e.g. div, p, li, a and etc.
//   _id  - id of the DOM element. if _id is an empty string, id will not be set.
//   _class - class of the DOM element. if _class is an empty string, class will not be set.
//   _text - inner content of the DOM element.
// returns:
//   Object - the created DOM element.
// e.g.: createDOMElement("li", "a-new-li", "list-item", "item") is equivalent to <li id="a-new-li" class="list-item">item</li> in HTML.
var createDOMElement = function(_tag, _id, _class, _text) {
	var dom_element = document.createElement(_tag);
	if (_id != "")
	{
		dom_element.setAttribute("id", _id);
	}

	if (_class != "")
	{
		dom_element.setAttribute("class", _class);
	}

	if (_text != "")
	{
		var text_node = document.createTextNode(_text);
		dom_element.appendChild(text_node);
	}

	return dom_element;
}