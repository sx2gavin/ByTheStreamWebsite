
/* TableContentGenerator generates a list of items as a table of content.
 * @param ar_titles - an array of strings,
 * @param table_of_content_object - the DOM object to hold the content,
 * @return boolean - whether the table of content is generated successfully.
 */
var tableContentGenerator = function(ar_titles, table_of_content_object) {
	// if ar_titles or table_of_content_object are not defined, simply return false
	if (!ar_titles || !table_of_content_object) {
		return false;
	}

	// first of all, remove all items from the DOM object first
	while (table_of_content_object.firstChild) {
		table_of_content_object.removeChild(table_of_content_object.firstChild);
	}
	
	// Add new contents to the table of content object
	
	for (var i = 0; i < ar_titles.length; i++)
	{
		var new_li_object = document.createElement("li");
		new_li_object.innerHTML = ar_titles[i];
		table_of_content_object.appendChild(new_li_object);
	}
	
	return true;
}

var pageInit = function() {
	var volume_titles = [];

	for (var i = 1; i < 52; i++) {
		volume_titles.push(i.toString());
	}

	var table_of_content_object = document.getElementById("table-of-content"); 

	if (tableContentGenerator(volume_titles, table_of_content_object) == false) {
		console.log("Failed to create table of content");
	}
}

