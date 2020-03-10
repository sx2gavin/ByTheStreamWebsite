var getAllVolumesList = function(callback) {

	/* Callback function to get a list of all volumes */
	loadJSON(REST_VOLUME_LIST, function(response) {
		var actual_JSON = JSON.parse(response);
		var array_volume_list = [];
		for (i in actual_JSON) {
			var volume_num = parseInt(actual_JSON[i]);
			if (volume_num != NaN) {
				array_volume_list.push(volume_num);
			}
		}
		array_volume_list.sort(function(a,b){return b-a});

		var table_of_content_object = document.getElementById("all-volume-list"); 

		// first of all, remove all items from the DOM object first
		while (table_of_content_object.firstChild) {
			table_of_content_object.removeChild(table_of_content_object.firstChild);
		}

		// generate all volumes list.
		// var currentVolumeId = getCurrentVolumeIdFromUrl();
		for (var i in array_volume_list)
		{
			var volume = array_volume_list[i];
			/*
			if (item.id == currentVolumeId) {
				var allVolumeHTML = document.getElementById('allVolumeMenuLink').innerHTML;
				allVolumeHTML =  allVolumeHTML.replace('所有期刊','');
				document.getElementById('allVolumeMenuLink').innerHTML = item.name + allVolumeHTML;
			}
			*/
			var new_link = document.createElement("a");
			new_link.className = 'dropdown-item';
			new_link.innerText = "第" + volume + "期";
			new_link.href = "volume?volume=" + volume;
			table_of_content_object.appendChild(new_link);
		}
		if (callback) {
			const latestVolume = array_volume_list[0];
			callback(latestVolume);
		}
	});
}
