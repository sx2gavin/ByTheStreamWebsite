var pageInit = function() { 
	$('body').bootstrapMaterialDesign(); 

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
			var card = createDOMElement('div', '', 'card', '');
			var card_button = createDOMElement('button', '', 'btn card-header-btn', '');
			card_button.onclick = function() {
				window.location.href = '/article?volume=' + item.volume + '&articleId=' + item.id;
			}
			var card_header = createDOMElement('h1', '', 'card-header', item.title);
			var card_author = createDOMElement('h2', '', '', item.author);
			card_button.appendChild(card_header);
			card_button.appendChild(card_author);
			card.appendChild(card_button);
			result_obj.appendChild(card);
		}
	});

}
