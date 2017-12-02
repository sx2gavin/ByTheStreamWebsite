var main = function()
{
	var simpleTraditionalChineseConverter = new SimpleToTraditionalConverter(); 

	var convertButtonClicked = function()
	{
		var descriptionHeader = document.getElementById("description");
		var str = descriptionHeader.innerHTML;

		descriptionHeader.innerHTML = simpleTraditionalChineseConverter.TransformString(str, 0);
	}

	var convertButton = document.getElementById("convert-button");
	convertButton.onclick = convertButtonClicked;
}


window.onload = main;
