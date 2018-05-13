
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
	var character_version = "simplified";
	var revert_character_version = "traditional";

	if ("character" in parameters) {
		character_version = parameters["character"];
	}

	if (character_version == "traditional") {
		revert_character_version = "simplified";
	}

	var enableDisableCharacterConvertButton = function(response) {
		var json = JSON.parse(response);
		var button = document.getElementById(DOM_CHARACTER_SWITCH_BUTTON);
		if (json.result == true) {
			button.style.display = "block";
			button.href = "volume?volume=" + selected_volume + "&character=" + revert_character_version;
		} else {
			button.style.display = "none";
		}
	}

	// enable or disable simplified or traditional Chinese switch button.
	loadJSON(REST_VERSION_AVAILABLE + "?volume=" + selected_volume + "&character=" + revert_character_version, enableDisableCharacterConvertButton);

	/* Callback function to get a list of all volumes */
	var parseAllVolumesList = function(response) {
		var actual_JSON = JSON.parse(response);

		var table_of_content_object = document.getElementById("all-volume-list"); 

		// first of all, remove all items from the DOM object first
		while (table_of_content_object.firstChild) {
			table_of_content_object.removeChild(table_of_content_object.firstChild);
		}

		// generate all volumes list.
		var volume_list = actual_JSON.volume_list;

		var currentVolumeId = getCurrentVolumeIdFromUrl();
		for (var i in volume_list)
		{
			var item = volume_list[i];
			if (item.id == currentVolumeId) {
				var allVolumeHTML = document.getElementById('allVolumeMenuLink').innerHTML;
				allVolumeHTML =  allVolumeHTML.replace('所有期刊','');
				document.getElementById('allVolumeMenuLink').innerHTML = item.name + allVolumeHTML;
			}
			var new_link = document.createElement("a");
			new_link.className = 'dropdown-item';
			var folder = item.folder;
			new_link.innerText = item.name;
			new_link.href = "volume?" + folder.replace('_', '=');
			table_of_content_object.appendChild(new_link);
		}
	}

	// To be added later.
	// loadJSON(CONTENT_FOLDER + VOLUME_LIST_FILE_NAME, parseAllVolumesList);

	/* Callback function to get content of an article */
	var addArticleToDiv = function(article_obj, article_div) {

		if (article_div && article_obj) {
			article_div.className = 'card';

			var article_div_header = document.createElement('div');
			article_div_header.className = 'card-header';
			article_div_header.id = 'heading' + article_obj.id;

			var article_div_header_btn = document.createElement('button');
			article_div_header_btn.className = 'btn card-header-btn';
			article_div_header_btn.setAttribute('data-toggle', 'collapse');
			article_div_header_btn.setAttribute('data-target', '#collapse' + article_obj.id);
			article_div_header_btn.setAttribute('aria-expanded', 'true');
			article_div_header_btn.setAttribute('aria-controls', 'collapse' + article_obj.id);

			var article_title = document.createElement('span');
			article_title.className = 'article-title';
			article_title.innerText = article_obj.title;

			var article_author = document.createElement('span');
			article_author.className = 'article-author text-muted';
			article_author.innerText = article_obj.author;

			var article_in_new_tab = document.createElement('a');
			article_in_new_tab.className = 'new-tab-link';
			article_in_new_tab.innerText = '开新窗口阅读';
			article_in_new_tab.href = '/article?volume=' + selected_volume + '&articleId=' + article_obj.id;
			article_in_new_tab.target = '_blank';

			article_div_header_btn.appendChild(article_title);
			article_div_header_btn.appendChild(article_author);
			article_div_header_btn.appendChild(article_in_new_tab);

			article_div_header.appendChild(article_div_header_btn);
			article_div.appendChild(article_div_header);

			var article_div_collapse = document.createElement('div');
			article_div_collapse.id = 'collapse' + article_obj.id;
			article_div_collapse.className = 'collapse show';
			article_div_collapse.setAttribute('aria-labelledby', 'heading' + article_obj.id);

			var article_div_body = document.createElement('div');
			article_div_body.className = 'card-body';


			// go through each line and check for <image.jpg> tags, replace it with a real <img> tag.
			for (var index in article_obj.content) {
				var line = article_obj.content[index].trim();
				if (line.length == 0 || 
					(line.length == 1 && line.charCodeAt(0) == 65532)) {
					continue;
				} else {
					var article_content = document.createElement("p");
					article_content.className = 'card-text';
					var article_text = "";


					if (line[0] === '<' && line[line.length-1] === '>') {
						article_text += "<img src=\"content/" + selected_volume + "/" + line.substring(1, line.length - 1) + "\" style=\"float:left; margin:10px;\" /><br />";
						continue;
					} else {
						article_text = line;
					}


					article_content.innerHTML = article_text.trim();
					article_div_body.appendChild(article_content);
				}
			}

			var hr_line = document.createElement("hr");
			article_div_body.appendChild(hr_line);
			article_div_collapse.appendChild(article_div_body);
			article_div.appendChild(article_div_collapse);
		}
	}

	var getWholeVolumeArticles = function(response) {
		if (response) {
			var articlesDictionary = JSON.parse(response);

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

					if ("title" in actual_JSON) {
						var title_object = createDOMElement("h1", "", "", actual_JSON["title"]);
						dom_content.appendChild(title_object);
					}

					if ("theme" in actual_JSON) {
						var theme_object = createDOMElement("h2", "", "", actual_JSON["theme"]);
						dom_content.appendChild(theme_object);
						dom_content.appendChild(document.createElement("hr"));
					}

					var text = "";

					var dom_nav_table_of_content = document.getElementById(DOM_NAV_TABLE_OF_CONTENT);

					// generate all volumes list.
					var table_of_content = actual_JSON.table_of_content;
					for (var i in table_of_content)
					{
						var dom_category_div = document.createElement("div");

						// Add category title
						var one_category = table_of_content[i];
						var category_name = one_category.category;
						if (category_name != null && category_name.trim() != "") {
							var category_header = createDOMElement("h3", "", "", category_name);
							dom_category_div.appendChild(category_header);
						}

						// Add a category title in the right side table of content.
						var category_header_in_toc = createDOMElement("li", "", "nav-item", category_name);
						if (table_of_content_object)
						{
							table_of_content_object.appendChild(category_header_in_toc);
						}

						var category_header_in_nav = createDOMElement("a", "", "dropdown-item font-weight-bold", category_name);
						if (dom_nav_table_of_content)
						{
							dom_nav_table_of_content.appendChild(category_header_in_nav);
						}

						// create a ul for each category.
						var category_table_of_content = createDOMElement("ul", "", "list-unstyled ml-1", "");
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
							var list_item = createDOMElement("li", "", "nav-item", "");
							var new_link = createDOMElement("a", "", "nav-link gl-toc-link", one_article.title);
							new_link.href = "#heading" + one_article.id;
							list_item.appendChild(new_link);
							category_table_of_content.appendChild(list_item);

							var navbar_link = createDOMElement("a", "", "dropdown-item ml-2", one_article.title);
							navbar_link.href = "#heading" + one_article.id;
							if (dom_nav_table_of_content)
							{
								dom_nav_table_of_content.appendChild(navbar_link);
							}

							// Adding a new empty div element with the article id. Content will be populated later.
							var article_section = createDOMElement("div", one_article.id, "", "");

							if (dom_category_div) {
								dom_category_div.appendChild(article_section);
							}

							var article_obj = articlesDictionary[one_article.id];

							addArticleToDiv(article_obj, article_section);
						}

						// Add this entire category div into content div.
						if (dom_content)
						{
							dom_content.appendChild(dom_category_div);
							dom_content.appendChild(document.createElement('br'));
						}
					}
					document.getElementById(DOM_TABLE_OF_CONTENT_CONTAINER_ID).style.display = '';
				}
			}

			loadJSON(REST_TABLE_OF_CONTENT + "?volume=" + selected_volume + "&character=" + character_version, parseTableOfContent);
		}
	}

	if (selected_volume)
	{
		loadJSON(REST_WHOLE_VOLUME + "?volume=" + selected_volume, getWholeVolumeArticles);
	}
}

var lastScrollPos = 0;
/* Sticky sidebar */
function updateSideBar() {
	var sideBarHeight = parseFloat(document.getElementById(DOM_TABLE_OF_CONTENT_CONTAINER_ID).offsetHeight);
	var windowHeight = parseFloat(window.innerHeight);
	var currentscrollPos = parseFloat(document.getElementsByTagName('html')[0].scrollTop);
	var sideBarTop = parseFloat(document.getElementById(DOM_TABLE_OF_CONTENT_CONTAINER_ID).style.top);

	if (currentscrollPos > lastScrollPos) {
		if (sideBarTop + sideBarHeight + 100 < currentscrollPos + windowHeight) {
			document.getElementById(DOM_TABLE_OF_CONTENT_CONTAINER_ID).style.top = (currentscrollPos + windowHeight - 100 - sideBarHeight) + 'px';
		}
	} else {
		if (currentscrollPos < sideBarTop) {
			document.getElementById(DOM_TABLE_OF_CONTENT_CONTAINER_ID).style.top = (currentscrollPos) + 'px';
		}
	}
	lastScrollPos = currentscrollPos;
}

function getCurrentVolumeIdFromUrl() {
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
