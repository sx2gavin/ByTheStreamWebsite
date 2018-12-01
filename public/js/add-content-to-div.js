var addContentToDiv = function(div, content, volumeNumber) {
	// go through each line and check for <image.jpg> tags, replace it with a real <img> tag.

    var floatLeft = true;
	for (var index in content) {
		var line = content[index].trim();
		if (line.length == 0 || 
			(line.length == 1 && line.charCodeAt(0) == 65532)) {
			continue;
		} else {
			if (line[0] === '<' && line[line.length-1] === '>') {
                var floatStyleText = floatLeft?'float-left':'float-right';
                image_obj = createDOMElement('img', '', 'article-img rounded d-inline ' + floatStyleText, '');
				image_obj.src = "content/volume_" + volumeNumber + "/images/" + line.substring(1, line.length -1);
				div.appendChild(image_obj);
                floatLeft = !floatLeft; // alternate image location from left to right to keep it interesting.
            } else {
				var p_obj = createDOMElement('p', '', 'card-text', line);
				div.appendChild(p_obj);
			}
		}
	}
}
