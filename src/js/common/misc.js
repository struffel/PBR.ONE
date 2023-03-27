import * as SCENESTATE from "./scenestate.js"

/**
 * Resizes the rendering area for ThreeJS based on the current window size (window.innerWidth/-Height).
 */
export function resizeRenderingArea(camera,renderer) {
	if(camera && renderer){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

/**
 * Tests if two arrays contain identical (===) values for every key.
 */
export function arrayEquals(a, b) {
	return Array.isArray(a) &&
	  Array.isArray(b) &&
	  a.length === b.length &&
	  a.every((val, index) => val === b[index]);
}

/**
 * Parses the hash string and returns a list of key-value pairs from it.
 * @returns 
 */
export function parseHashString(){

	if(!window.location.href.includes('#')){
		return {};
	}

	var hashString = window.location.href.substring(window.location.href.indexOf('#') + 1);
	console.debug("Read hashstring: #",hashString);

	if(hashString == ""){
		return {};
	}

	var hashStringFragments = hashString.split(',');

	var output = {};

	hashStringFragments.forEach(fragment => {
		console.debug("Parsing fragment: ",fragment);

		var keyValuePair = fragment.split('=');

		if(keyValuePair[1].includes(';')){
			keyValuePair[1] = keyValuePair[1].split(";");
		}

		output[keyValuePair[0]] = keyValuePair[1];
	});

	return output;
}

/**
 * Sets the watermark style.
 * @param {*} newStyle 
 */
export function updateWatermark(newStyle){
	var newWatermarkClass = "watermark ";
	switch (newStyle) {
		case 'off':
			newWatermarkClass += "watermark-off";
			break;
		case 'small':
			newWatermarkClass += "watermark-small";
			break;
		case 'large':
		default:
			newWatermarkClass += "watermark-large";
			break;
	}
	document.querySelector('.watermark').setAttribute("class",newWatermarkClass);
}

/**
 * Updates all the settings in the GUI to match the current scene configuration.
 */
export function updateGuiFromCurrentSceneConfiguration(){
	var currentConfiguration = SCENESTATE.getCurrentConfiguration();
	
	// Iterate over all elements by id and set their value
	for(var key in currentConfiguration){
		var target = document.getElementById(key);
		if(target != null && target.value != undefined){
			target.value = currentConfiguration[key];
		}
		if(target != null && target.checked != undefined){
			target.checked = Boolean(parseInt(currentConfiguration[key]));
		}
	}

	// Show or hide nav elements that are only necessary for multivalued inputs (like choosing multiple maps/materials).
	
	// Select all Elements with the 'pbr1-onlyshowifmultivalued' attribute
	document.querySelectorAll("*[pbr1-onlyshowifmultivalued]").forEach((element) =>{
		// Get the value of the attribute to determine which key of the scene configuration must me multivalued for this element to be visible
		var targetConfigurationParameter = element.attributes['pbr1-onlyshowifmultivalued'].value;

		// Check if the target parameter exists and is multivalued

		if( Array.isArray(currentConfiguration[targetConfigurationParameter]) && currentConfiguration[targetConfigurationParameter].length > 1){
			element.style.display="unset";
		}else{
			element.style.display="none";
		}

	});

	//Update dropdown options
	document.querySelectorAll("*[pbr1-optionsource]").forEach((element) =>{
		element.innerHTML = '';
		var targetConfigurationParameter = element.attributes['pbr1-onlyshowifmultivalued'].value;
		for (let i = 0; i < currentConfiguration[targetConfigurationParameter].length; i++) {
			var opt = document.createElement('option');
			opt.value = i;
			opt.selected = currentConfiguration[element.attributes['pbr1-selectedsource'].value] == i;
			opt.innerHTML = currentConfiguration[targetConfigurationParameter][i];
			element.appendChild(opt);
		}
	});

}