var main = function() {

    getAllVolumesList((latestVolume) => {
        document.getElementById("read-button").href = ("/volume?volume=" + latestVolume);
        document.getElementById("read-button").innerText = "阅读最新期刊 - 第" + latestVolume + "期";
    });

	var parameters = parseURL(window.location.href);

    var characterVersion = "simplified";

	if ("character" in parameters) {
		characterVersion = parameters["character"];
	} else {
        characterVersion = getCookie("character");
        if (characterVersion == "") {
            characterVersion = "simplified";
        }
    }
    setCookie("character", characterVersion, 365);

	var invertCharacterVersion = "traditional";

	if (characterVersion == "traditional") {
		invertCharacterVersion = "simplified";
	}

    var characterTransformButton = document.getElementById(DOM_CHARACTER_SWITCH_BUTTON);
    characterTransformButton.style.display = "block";
    characterTransformButton.href = "?character=" + invertCharacterVersion;

    
    if (characterVersion == "traditional") {
        var readButton = document.getElementById("read-button");
        readButton.href = "volume?character=traditional";

        var translator = new SimpleToTraditionalConverter;
        var convertibleDOMs = document.getElementsByClassName("character-convertible");
        for (var i = 0; i < convertibleDOMs.length; i++) {
            convertibleDOMs[i].textContent = translator.transformString(convertibleDOMs[i].textContent, 0);
        }
    }
}

window.onload = main;
