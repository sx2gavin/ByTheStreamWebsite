
/* parse url in this function */
var parseURL = function(url) {

	var parameter_string = url.split("?")[1];

	// remove stuff after symbol #
	parameter_string = parameter_string.split('#')[0];

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



/* The volume.html page is initialized here. */
var pageInit = function() {

	var parameters = parseURL(window.location.href);
	var selected_volume = parameters["volume"];

	/* Callback function to get a list of all volumes */
	/*
	var parseAllVolumesList = function(response) {
		var actual_JSON = JSON.parse(response);

		var table_of_content_object = document.getElementById("all-volume-list"); 

		// first of all, remove all items from the DOM object first
		while (table_of_content_object.firstChild) {
			table_of_content_object.removeChild(table_of_content_object.firstChild);
		}

		// generate all volumes list.
		var volume_list = actual_JSON.volume_list;
		for (var i in volume_list)
		{
			var item = volume_list[i];
			var new_link = document.createElement("a");
			var item_name = document.createTextNode(item.name);
			var folder = item.folder;
			new_link.appendChild(item_name);
			new_link.href = "volume_table_content.html?folder=" + folder;

			var new_li_object = document.createElement("li");
			new_li_object.appendChild(new_link);
			table_of_content_object.appendChild(new_li_object);
		}
	}

	loadLocalJSON(parseAllVolumesList, CONTENT_FOLDER + VOLUME_LIST_FILE_NAME);
	*/


	/* Callback function to get content of an article */
	var parseArticle = function(response) {

		if (response) {
			var actual_JSON = JSON.parse(response);

			var article_div = document.getElementById(actual_JSON.id);
			if (article_div) {

				var anchor = document.createElement("a");
				anchor.setAttribute("id", "anchor-" + actual_JSON.id);
				anchor.setAttribute("class", "gl-anchor-link");
				article_div.appendChild(anchor);

				var title_header = document.createElement("h1");
				title_header.setAttribute("class", "article-title");
				var title_name = document.createTextNode(actual_JSON.title);
				title_header.appendChild(title_name);
				article_div.appendChild(title_header);

				var author_header = document.createElement("h2");
				author_header.setAttribute("class", "article-author");
				var author_name = document.createTextNode(actual_JSON.author);
				author_header.appendChild(author_name);
				article_div.appendChild(author_header);

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
				article_div.appendChild(article_content);

				var hr_line = document.createElement("hr");
				article_div.appendChild(hr_line);
			}
		}
	}

	/* callback */
	/* parse table of content json */
	/* figure out all the available articles. */
	var parseTableOfContent = function(response) {

		if (response) {
			var actual_JSON = JSON.parse(response);

			var table_of_content_object = document.getElementById(DOM_TABLE_OF_CONTENT_ID);

			// first of all, make sure this DOM is empty.
			if (table_of_content_object)
			{
				while (table_of_content_object.firstChild) {
					table_of_content_object.removeChild(table_of_content_object.firstChild);
				}
			}

			var dom_content = document.getElementById(DOM_CONTENT_ID);
			var text = "";

			var dom_nav_table_of_content = document.getElementById(DOM_NAV_TABLE_OF_CONTENT);

			// generate all volumes list.
			var table_of_content = actual_JSON.table_of_content;
			for (var i in table_of_content)
			{
				// add category title
				var one_category = table_of_content[i];
				var category_name = one_category.category;
				var category_header = document.createElement("h1");
				text = document.createTextNode(category_name);
				category_header.appendChild(text);
				// todo: add category header to table of content.
				// table_of_content_object.appendChild(category_header);
				if (dom_content) {
					dom_content.appendChild(category_header);
				}

				// create a ul for each category.
				var category_table_of_content = document.createElement("ul");
				category_table_of_content.setAttribute("class", "list-unstyled");

				if (table_of_content_object)
				{
					table_of_content_object.appendChild(category_table_of_content);
				}

				// Add link for each article
				// Parse article contents.
				var articles = one_category.articles;
				for (var j in articles) {
					var one_article = articles[j];

					// Adding new link into table of content
					var list_item = document.createElement("li");
					list_item.setAttribute("class", "nav-item");
					var new_link = document.createElement("a");
					new_link.setAttribute("class", "nav-link gl-toc-link");
					var article_name = document.createTextNode(one_article.title);
					new_link.appendChild(article_name);
					new_link.href = "#anchor-" + one_article.id;
					list_item.appendChild(new_link);
					category_table_of_content.appendChild(list_item);

					var navbar_link = document.createElement("a");
					navbar_link.setAttribute("class", "dropdown-item ml-1");
					article_name = document.createTextNode(one_article.title);
					navbar_link.appendChild(article_name);
					navbar_link.href = "#anchor-" + one_article.id;
					if (dom_nav_table_of_content)
					{
						dom_nav_table_of_content.appendChild(navbar_link);
					}

					// Adding a new empty div element with the article id. Content will be populated later.
					var article_section = document.createElement("div");
					article_section.setAttribute("id", one_article.id);
					
					if (dom_content) {
						dom_content.appendChild(article_section);
					}

					loadLocalJSON(parseArticle, CONTENT_FOLDER + VOLUME_FOLDER_PREFIX + selected_volume + "/" + one_article.file);
				}
			}
		}
	}

	if (selected_volume)
	{
		var file = CONTENT_FOLDER + VOLUME_FOLDER_PREFIX + selected_volume + "/" + TABLE_OF_CONTENT_FILE_NAME;
		loadLocalJSON(parseTableOfContent, file);
	}

	/*
	var updateTOCHeight = function()
	{
		var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		var table_of_content_object = document.getElementById(DOM_TABLE_OF_CONTENT_ID);
		var footer_object = document.getElementById("footer");
		if (table_of_content_object)
		{
			table_of_content_object.clientHeight = viewport_height - footer_object.clientHeight;
		}
	}

	window.onscroll = updateTOCHeight;
	*/
}
