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

var dispatchPOSTRequest = function(path, body, callback) {
	var xobj = new XMLHttpRequest();
	xobj.onreadystatechange = function() {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	}
	xobj.open("POST", path, true);
	xobj.setRequestHeader('Content-Type', 'application/json');
	xobj.send(JSON.stringify(body));
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

/* parse url in this function */
var parseURL = function(url) {

	var url_array = url.split("?");
	var parameters = {};

	if (url_array.length > 1) {
		var parameter_string = url_array[1];

		// remove stuff after symbol #
		parameter_string = parameter_string.split('#')[0];


		if (parameter_string == "") {
			return parameters;
		}

		var parameter_list = parameter_string.split("&");

		for (var i in parameter_list) {
			var pair = parameter_list[i];
			var pair_tuple = pair.split("=");

			// wrong parameter passing, skip.
			if (pair_tuple.length < 2) {
				continue;
			} else {
				if (parameters.hasOwnProperty(pair_tuple[0]))
				{
					console.error("Warning: duplicate parameter names, value will be overwritten.");
				}
				parameters[pair_tuple[0]] = pair_tuple[1];
			}
		}
	}
	return parameters;
}

var setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

var getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var checkCookie = function() {
    var user = getCookie("character");
    if (user == "") {
        user = "simplified";
        setCookie("character", user, 365);
    }
}

var getUserId = function() {
	const userText = localStorage.getItem("user");
	if (!userText) return undefined;
	return JSON.parse(userText).id;
}

var getCurrentVolumeIdFromUrl = function() {
	var search = window.location.search.replace('?', '');
	var keyValuePairs = search.split('&');
	var keys = [], values = [];
	for (var i in keyValuePairs) {
		var keyValue = keyValuePairs[i].split('=');
		if (keyValue.length == 2 && keyValue[0].toLowerCase() == 'volume') {
			return keyValue[1];
		}
	}
	return null;
}

var logArticleAccess = function(category, articleTitle, articleId) {
	const userId = getUserId();
	if (!userId) return;
	const volumeId = getCurrentVolumeIdFromUrl();
	if (!volumeId) return;
	dispatchPOSTRequest(REST_NEW_USAGE, {userId, volumeId, category, articleTitle, articleId}, function(response) {
		console.log(response);
	})
}