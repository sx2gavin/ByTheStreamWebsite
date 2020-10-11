var main = function() { 
	getAllVolumesList();

	var parameters = parseURL(window.location.href);
	var text = "";
	if ("text" in parameters) {
		text = parameters["text"];
	}

	var characters = String.fromCharCode(parseInt(text,16));

	var header = document.getElementById("header");
	header.textContent = "搜索结果：" + decodeURIComponent(text);
	document.title = "溪水旁 - 搜索 - " + decodeURIComponent(text);

	loadJSON(REST_SEARCH + "?text=" + text, function(response) {
		var result_list = JSON.parse(response);
		var result_obj = document.getElementById("search-list-container");

		if (result_list.length == 0) {
			var warning = createDOMElement('h6', '', '', '未找到相关文章');
			result_obj.appendChild(warning);
		}

		for (i in result_list) {
			var item = result_list[i];
			var card = createDOMElement('div', '', 'card my-3', '');
			var card_header = createDOMElement('div', '', 'card-header', '');
			var card_header_text = createDOMElement('h4', '', 'd-inline', item.title);
			var card_volume_link = createDOMElement('a', '', 'btn btn-raised text-primary d-inline ml-3', '第'+item.volume+'期');
			card_volume_link.href = '/volume?volume=' + item.volume;
			var card_category_link = createDOMElement('a', '', 'btn btn-raised text-success d-inline ml-3', item.category);
			card_category_link.href = '/search?text=' + item.category;
			var card_author_link = createDOMElement('a', '', 'btn btn-raised text-secondary d-inline ml-3', '作者：'+item.author);
			card_author_link.href = '/search?text=' + item.author;
			var card_body = createDOMElement('div', '', 'card-body', '');

			for (j in item.content) {
				if (j > 2) {
					break;
				}
				var line = item.content[j].trim();
				if (line.length == 0 || (line.length == 1 && line.charCodeAt(0) == 65532)) {
					continue;
				} else if (line[0] === '<' && line[line.length-1] === '>') {
					continue; // don't show images in the search.
				} else {
					var p_obj = createDOMElement('p', '', 'card-text', line);
					card_body.appendChild(p_obj);
				}
			}

			var card_button = createDOMElement('a', '', 'btn btn-primary', '阅读更多');
			card_button.href = '/article?volume=' + item.volume + '&articleId=' + item.id;

			card_header.appendChild(card_header_text);
			card_header.appendChild(card_volume_link);
			card_header.appendChild(card_category_link);
			card_header.appendChild(card_author_link);
			card.appendChild(card_header);
			card.appendChild(card_body);
			card_body.appendChild(card_button);
			result_obj.appendChild(card);
		}
	});
}

window.onload = main;
