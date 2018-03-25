

/* The article.html page is initialized here. */

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

var pageInit = function() {
	var parameters = parseURL(window.location.href);
	var selected_volume = parameters["folder"];
	var selected_article = parameters["article"];

	/* callback */
	/* parse table of content json */
	var parseArticle = function(response) {

		if (response) {
			var actual_JSON = JSON.parse(response);

			var author_div = document.getElementById("author-div");
			while (author_div.firstChild) {
				author_div.removeChild(author_div.firstChild);
			}
			var author_header = document.createElement("h2");
			var author_name = document.createTextNode(actual_JSON.author);
			author_header.appendChild(author_name);
			author_div.appendChild(author_header);

			var title_div = document.getElementById("title-div");
			while (title_div.firstChild) {
				title_div.removeChild(title_div.firstChild);
			}
			var title_header = document.createElement("h1");
			var title_name = document.createTextNode(actual_JSON.title);
			title_header.appendChild(title_name);
			title_div.appendChild(title_header);

			var article_div = document.getElementById("article-div");
			while (article_div.firstChild) {
				article_div.removeChild(article_div.firstChild);
			}
			var article_content = document.createElement("p");
			var article_text = "";

			// go through each line and check for <image.jpg> tags, replace it with a real <img> tag.
			for (var index in actual_JSON.content) {
				var line = actual_JSON.content[index];
				if (line.length > 0) {
					if (line[0] === '<' && line[line.length-1] === '>') {
						article_text += "<img src=\"content/" + selected_volume + "/" + line.substring(1, line.length - 1) + "\" style=\"float:left; margin:10px;\" /><br />";
						continue;
					}
				}

				article_text += line + "<br />";
			}

			article_content.innerHTML = article_text;
			// var article = document.createTextNode(actual_JSON.content);
			// article_content.appendChild(article);
			article_div.appendChild(article_content);
		}
	}

	if (selected_volume && selected_article) {
		var file_loc = "content/" + selected_volume + "/" + selected_article;

		loadLocalJSON(parseArticle, file_loc);
	}

	if (selected_volume) {
		var back_link = document.getElementById("back");
		back_link.href = "volume_table_content.html?folder=" + selected_volume;
	}
}

