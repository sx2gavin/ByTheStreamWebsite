var pageInit = function() { 
	$('body').bootstrapMaterialDesign(); 

	var searchList = window.location.search.replace('?','').split('&');
	var volume = null, articleId = null;
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

	loadJSON('/content/volume_' + volume + '/' + articleId + '.json', function(response) {
		var article_obj = JSON.parse(response);
		var article_div = document.getElementById('article-container');

		var article_div_header = document.createElement('div');
		article_div_header.className = 'card-header';
		article_div_header.style.padding = '1.6rem 1rem';
		article_div_header.id = 'heading' + article_obj.id;

		var article_title = document.createElement('span');
		article_title.className = 'article-title';
		article_title.innerText = article_obj.title;

		var article_author = document.createElement('span');
		article_author.className = 'article-author text-muted';
		article_author.innerText = article_obj.author;

		article_div_header.appendChild(article_title);
		article_div_header.appendChild(article_author);
		article_div.appendChild(article_div_header);

		var article_div_collapse = document.createElement('div');
		article_div_collapse.className = 'collapse show';

		var article_div_body = document.createElement('div');
		article_div_body.className = 'card-body';

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
		article_div_collapse.appendChild(article_div_body);
		article_div.appendChild(article_div_collapse);
	});
}
