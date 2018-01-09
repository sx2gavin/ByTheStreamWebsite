

/* The article.html page is initialized here. */
var pageInit = function() {

	/* callback */
	/* parse table of content json */
	var parseArticle = function(response) {

		if (response) {
			var actual_JSON = JSON.parse(response);

			var author_div = document.getElementById("author-div");

			var author_header = document.createElement("h2");
			var author_name = document.createTextNode(actual_JSON.author);
			author_header.appendChild(author_name);
			author_div.appendChild(author_header);

			var article_div = document.getElementById("article-div");
			var article_content = document.createElement("p");
			var article_text = "";

			for (var index in actual_JSON.content) {
				article_text += actual_JSON.content[index] + "<br />";
			}

			article_content.innerHTML = article_text;
			// var article = document.createTextNode(actual_JSON.content);
			// article_content.appendChild(article);
			article_div.appendChild(article_content);
		}
	}
	
	var parameters = parseURL(window.location.href);

	var selected_folder = parameters["folder"];

	var selected_article = parameters["article"];

	if (selected_folder && selected_article) {
		var file_loc = "content/" + selected_folder + "/" + selected_article;

		loadLocalJSON(parseArticle, file_loc);
	}

	if (selected_folder) {
		var back_link = document.getElementById("back");
		back_link.href = "volume_table_content.html?folder=" + selected_folder;
	}
}

/* parse url in this function */
var parseURL = function(url) {

	var parameter_string = url.split("?")[1];
	var parameters = {};

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

	return parameters;
}

