var addContentToDiv = function(div, content, volumeNumber) {
    // go through each line and check for <image.jpg> tags, replace it with a real <img> tag.

    var floatLeft = true;
    for (var index in content) {
        // var line = content[index].trim();
        if (line.length == 0 || 
            (line.length == 1 && line.charCodeAt(0) == 65532)) {
            continue;
        } else {
            if (line[0] === '<' && line[line.length-1] === '>') {
                var trimmedLine = line.substring(1, line.length - 1);
                var tokens = trimmedLine.split(',');
                var filename = tokens[0];
                var floatStyleText = floatLeft?'left-img-container':'right-img-container';
                var div_obj = createDOMElement('div', '', floatStyleText, '');
                var image_obj = createDOMElement('img', '', 'article-img rounded', '');
                image_obj.src = "content/volume_" + volumeNumber + "/images/" + filename;
                div_obj.appendChild(image_obj);
                
                if (tokens.length > 1)
                {
                    var description = tokens[1];
                    var text_obj = createDOMElement('p', '', 'img-description',  description);
                    div_obj.appendChild(text_obj);
                }
                div.appendChild(div_obj);
                floatLeft = !floatLeft; // alternate image location from left to right to keep it interesting.
            } else {
                var p_obj = createDOMElement('p', '', 'card-text', line);
                div.appendChild(p_obj);
            }
        }
    }
}
