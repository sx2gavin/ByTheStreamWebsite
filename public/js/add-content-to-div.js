var addContentToDiv = function(div, content, volumeNumber) {
	// go through each line and check for <image.jpg> tags, replace it with a real <img> tag.
	for (var index in content) {
		var line = content[index].trim();
		if (line.length == 0 || 
			(line.length == 1 && line.charCodeAt(0) == 65532)) {
			continue;
		} else {
			if (line[0] === '<' && line[line.length-1] === '>') {
				var image_obj = createDOMElement('img', '', 'article-img card-img img-fluid rounded d-inline-block', '');
				image_obj.src = "content/volume_" + volumeNumber + "/images/" + line.substring(1, line.length -1);
				div.appendChild(image_obj);
				// var article_text += "<img src=\"content/" + selected_volume + "/" + line.substring(1, line.length - 1) + "\" style=\"float:left; margin:10px;\" /><br />";
			} else {
				var p_obj = createDOMElement('p', '', 'card-text', line);
				div.appendChild(p_obj);
			}
		}
	}
}
