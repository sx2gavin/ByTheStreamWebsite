var main = function() { 

	getAllVolumesList();

    $(window).scroll(mainContentScrolled);

    $("#return-top-button").click(function() {
        $(window).scrollTop(0);
    });

	var searchList = window.location.search.replace('?','').split('&');
	var volume = null;
	var articleId = null;
	for (var i = 0; i < searchList.length; i++) {
		var searchKvp = searchList[i].split('=');
		if (searchKvp.length == 2) {
			switch (searchKvp[0]) {
				case "volume":
					volume = searchKvp[1];
					break;
				case "articleId":
					articleId = searchKvp[1];
					break;
			}
		}
	}
	if (volume == null) {
		var errorContainer = document.getElementById("article-error-container"); 
		errorContainer.innerText = 'Please specify volume number in url.';
	} else if (articleId == null) {
		var errorContainer = document.getElementById("article-error-container"); 
		errorContainer.innerText = 'Please specify article id in url.';
	}

	loadJSON(REST_ARTICLES + "?volume=" + volume + "&name=" + articleId, function(response) {

		var article_obj = JSON.parse(response);

		document.title = "溪水旁 - " + article_obj.title + " - " + article_obj.author; 

		var article_div = document.getElementById('article-container');

		var article_div_header = document.createElement('div');
		article_div_header.className = 'card-header';
		article_div_header.style.padding = '1.6rem 1rem';
		article_div_header.id = 'heading' + article_obj.id;

		var article_title = document.createElement('span');
		article_title.className = 'article-title';
		article_title.innerText = article_obj.title;

		var article_volume_link = createDOMElement('a', '', 'btn btn-raised text-primary d-inline ml-3', '第' + article_obj.volume + '期');
		article_volume_link.href = '/volume?volume=' + article_obj.volume;

		var article_category_link = createDOMElement('a', '', 'btn btn-raised text-success d-inline ml-3', article_obj.category);
		article_category_link.href = '/search?text=' + article_obj.category;

		var article_author = createDOMElement('a', '', 'btn btn-raised text-secondary d-inline ml-3', '作者：'+ article_obj.author);
		article_author.href = '/search?text=' + article_obj.author;
		// article_author.className = 'article-author text-muted';

		article_div_header.appendChild(article_title);
		article_div_header.appendChild(article_volume_link);
		article_div_header.appendChild(article_category_link);
		article_div_header.appendChild(article_author);
		article_div.appendChild(article_div_header);

		var article_div_collapse = document.createElement('div');
		article_div_collapse.className = 'collapse show';

		var article_div_body = document.createElement('div');
		article_div_body.className = 'card-body';

		// from add-content-to-div.js
		addContentToDiv(article_div_body, article_obj.content, article_obj.volume);

		article_div_collapse.appendChild(article_div_body);
		article_div.appendChild(article_div_collapse);

		logArticleAccess(article_obj.category, article_obj.title, article_obj.id);
	});
}

var mainContentScrolled = function() {
    if ($(window).scrollTop() > 20) {
        $("#return-top-button").css("display", "block");
    } else {
        $("#return-top-button").css("display", "none");
    }
}

window.onload = main;
