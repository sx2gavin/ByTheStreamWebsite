
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

/* The all_volumes.html page is initialized here. */
var pageInit = function() {

	loadLocalJSON(parseAllVolumesList, "content/volume_list.json");

	//	var volume_titles = [];
	//
	//	for (var i = 1; i < 52; i++) {
	//		volume_titles.push(i.toString());
	//	}
	//
	//	var table_of_content_object = document.getElementById("table-of-content"); 
	//
	//	if (tableContentGenerator(volume_titles, table_of_content_object) == false) {
	//		console.log("Failed to create table of content");
	//	}
}

var parseAllVolumesList = function(response) {
	var actual_JSON = JSON.parse(response);

	var table_of_content_object = document.getElementById("all-volume-list"); 

	// first of all, remove all items from the DOM object first
	while (table_of_content_object.firstChild) {
		table_of_content_object.removeChild(table_of_content_object.firstChild);
	}

	// generate all volumes list.
	var volume_list = actual_JSON.volume_list;
	for (var i in volume_list)
	{
		var item = volume_list[i];
		var new_link = document.createElement("a");
		var item_name = document.createTextNode(item.name);
		var folder = item.folder;
		new_link.appendChild(item_name);
		new_link.href = "volume_table_content.html?folder=" + folder;

		var new_li_object = document.createElement("li");
		new_li_object.appendChild(new_link);
		table_of_content_object.appendChild(new_li_object);
	}
}
