

/* The all_volumes.html page is initialized here. */
var pageInit = function() {

	/* callback */
	/* parse table of content json */
	var parseTableOfContent = function(response) {

		if (response) {
			var actual_JSON = JSON.parse(response);

			var table_of_content_object = document.getElementById("table-of-content");

			// first of all, remove all items from the DOM object first
			while (table_of_content_object.firstChild) {
				table_of_content_object.removeChild(table_of_content_object.firstChild);
			}

			// generate all volumes list.
			var table_of_content = actual_JSON.table_of_content;
			for (var i in table_of_content)
			{
				// Add category titles
				var one_category = table_of_content[i];
				var category_name = one_category.category;
				var category_header = document.createElement("h1");
				var text = document.createTextNode(category_name);
				category_header.appendChild(text);
				table_of_content_object.appendChild(category_header);

				// Add link for each article
				var articles = one_category.articles;

				for (var j in articles) {
					var one_article = articles[j];
					var new_link = document.createElement("a");
					var article_name = document.createTextNode(one_article.title);
					new_link.appendChild(article_name);

					new_link.href = "article.html?folder=" + selected_folder + "&article=" + one_article.file;

					var new_li_object = document.createElement("li");
					new_li_object.appendChild(new_link);
					table_of_content_object.appendChild(new_li_object);
				}
			}
		}
	}
	
	var parameters = parseURL(window.location.href);

	var selected_folder = parameters["folder"];

	if (selected_folder) {
		var table_of_content_file_loc = "content/" + selected_folder + "/table_of_content.json";

		loadLocalJSON(parseTableOfContent, table_of_content_file_loc);
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

