var main = function() { 
	getAllVolumesList();

	var parameters = parseURL(window.location.href);
	var text = "";
	if ("text" in parameters) {
		text = parameters["text"];
	}

	loadJSON(REST_SEARCH + "?text=" + text, function(response) {
		var result_list = JSON.parse(response);
		var result_obj = document.getElementById("search-list-container");

		for (i in result_list) {
			var item = result_list[i];
			var card = createDOMElement('div', '', 'card m-3', '');
			var card_header = createDOMElement('div', '', 'card-header', '');
			var card_header_text = createDOMElement('h4', '', '', item.title);
			var card_body = createDOMElement('div', '', 'card-body', '');
			var card_title = createDOMElement('h6', '', 'card-title', '第'+item.volume+'期');
			var card_author = createDOMElement('h6', '', 'card-subtitle mb-2 text-muted', '作者：' + item.author);
			var card_content = createDOMElement('p', '', 'card-text', item.content[0] + item.content[1] + item.content[2]);
			var card_button = createDOMElement('a', '', 'btn btn-primary', '阅读更多');
			card_button.href = '/article?volume=' + item.volume + '&articleId=' + item.id;

			card_header.appendChild(card_header_text);
			card.appendChild(card_header);
			card.appendChild(card_body);
			// card_body.appendChild(card_title);
			card_body.appendChild(card_author);
			card_body.appendChild(card_content);
			card_body.appendChild(card_button);
			result_obj.appendChild(card);
		}
	});
}

window.onload = main;
