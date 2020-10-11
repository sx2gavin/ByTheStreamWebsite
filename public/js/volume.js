/* The volume.html page is initialized here. */
var main = function() {

    $("#content").scroll(mainContentScrolled);

    $("#return-top-button").click(function() {
        $("#content").scrollTop(0);
    });

	getAllVolumesList();

	var parameters = parseURL(window.location.href);

	var selected_volume = LATEST_VOLUME_NUMBER;
	
	if ("volume" in parameters) {
		selected_volume = parameters["volume"];
	}

	var character_version = "simplified";
	var revert_character_version = "traditional";

	if ("character" in parameters) {
		character_version = parameters["character"];
	}

	if (character_version == "traditional") {
		revert_character_version = "simplified";
	}

	// enable or disable simplified or traditional Chinese switch button.
	loadJSON(REST_VERSION_AVAILABLE + "?volume=" + selected_volume + "&character=" + revert_character_version, function(response) {
		var json = JSON.parse(response);
		var button = document.getElementById(DOM_CHARACTER_SWITCH_BUTTON);
		if (json.result == true) {
			button.style.display = "block";
			button.href = "volume?volume=" + selected_volume + "&character=" + revert_character_version;
		} else {
			button.style.display = "none";
		}
	});

	/* Callback function to get content of an article */
	var addArticleToDiv = function(article_obj, article_div) {

		if (article_div && article_obj) {
			// var article_anchor = createDOMElement('a', 'heading' + article_obj.id, 'gl-anchor-link', "");
			// article_div.appendChild(article_anchor);

			article_div.className = 'card';

			var article_div_header = document.createElement('div');
			article_div_header.setAttribute('class', 'card-header');
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

			// from add-content-to-div.js
			addContentToDiv(article_div_body, article_obj.content, selected_volume);

			article_div_collapse.appendChild(article_div_body);
			article_div.appendChild(article_div_collapse);
		}
	}

	if (selected_volume)
	{
		// Get content of the whole volume.
		loadJSON(REST_ARTICLES + "?volume=" + selected_volume, function(response) {
			if (response) {
				var articlesDictionary = JSON.parse(response);

				/* callback */
				/* parse table of content json */
				/* figure out all the available articles. */
				loadJSON(REST_TABLE_OF_CONTENT + "?volume=" + selected_volume + "&character=" + character_version, function(response) {

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
							document.title = actual_JSON["title"];
						}

						if ("theme" in actual_JSON) {
							var theme_object = createDOMElement("h2", "", "", actual_JSON["theme"]);
							dom_content.appendChild(theme_object);
						}

						if ("year" in actual_JSON && "month" in actual_JSON ) {
							var year = actual_JSON["year"];
							var month = actual_JSON["month"];
							var date_object = createDOMElement("h4", "", "", year + '年' + month + '月出版');
							dom_content.appendChild(date_object);
						}

						dom_content.appendChild(document.createElement("hr"));

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
								var new_link = createDOMElement("a", "", "nav-link gl-toc-link", one_article.author + " - " + one_article.title);
								new_link.href = "#heading" + one_article.id;
								new_link.setAttribute("onclick", 
									`logArticleAccess('${category_name}', '${one_article.title}', '${one_article.id}')`);
								list_item.appendChild(new_link);
								category_table_of_content.appendChild(list_item);

								var navbar_link = createDOMElement("a", "", "dropdown-item ml-2", one_article.author + " - " + one_article.title);
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
					} // if
				}); // loadJSON
			} // if 
		}); // loadJSON
	} // if 
	userRegistration();
	logVolumeAccess();
}

var lastScrollPos = 0;

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

var mainContentScrolled = function() {
    if ($("#content").scrollTop() > 20) {
        $("#return-top-button").css("display", "block");
    } else {
        $("#return-top-button").css("display", "none");
    }
}

var logVolumeAccess = function() {
	const userId = getUserId();
	if (!userId) return;
	const volumeId = getCurrentVolumeIdFromUrl();
	if (!volumeId) return;
	dispatchPOSTRequest(REST_NEW_USAGE, {userId, volumeId}, function(response) {
		console.log(response);
	});
}

window.onload = main;
