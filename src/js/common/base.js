import * as THREE from '../threejs/three.module.js';
import * as CONSTANTS from './constants.js';
import * as SCENESTATE from './scenestate.js';

/**
 * A small function assigned to the global window object that makes it possible to trigger scene configuration updates using inline JS.
 * It is added to the window object to make it accessible everywhere, even outside module code.
 * @param {*} changedConfig 
 * @param {*} resetValues 
 */
window.PBR1_CHANGE = function(changedConfig,resetValues = false){
    var evt = new CustomEvent('PBR1_CHANGE',{"detail": {"changedConfiguration": changedConfig,"resetValues":resetValues}});
    document.dispatchEvent(evt);
}

/**
 * Re-parses the current hashstring and runs the updateFunction supplied to it.
 * @param {*} updateFunction 
 */
function handleHashStringChange(updateFunction){
	var parsedHashString = parseHashString();
	updateWatermark(parsedHashString['watermark']);
	updateFunction(parsedHashString,CONSTANTS.fallback.default);
}

/**
 * Handles a GUI change event and runs the supplied update function.
 */
function handleGUIChangeEvent(e,updateFunction){

	var changedConfiguration = e.detail.changedConfiguration;
	if(e.detail.resetValues){
		for (var key in changedConfiguration){
			changedConfiguration[key] = SCENESTATE.getDefaultConfiguration()[key];
		} 
	}

	updateFunction(changedConfiguration,CONSTANTS.fallback.current);
}

/**
 * The main function that starts the preview.
 */
export function start(initializationFunction,updateFunction,animationFunction){

	// Run the supplied initializationFunction
	initializationFunction();

	// Handle GUI changes
	document.addEventListener("PBR1_CHANGE",(e) => { 
		handleGUIChangeEvent(e,updateFunction)
	});
	
	// Handle changes in the hash
	window.addEventListener('hashchange', (e) =>{
		handleHashStringChange(updateFunction)
	});

	// Perform the initial loading by simulating a change in the hashstring.
	handleHashStringChange(updateFunction);

	// Run the animation function for THREE.js, if supplied.
	// Not all views use this.
	if(animationFunction){
		animationFunction();
	}
}

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
 * Tests if two arrays have the same length contain identical (===) values for every key.
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

	if(hashString == ""){
		return {};
	}

	var hashStringFragments = hashString.split(',');

	var output = {};

	hashStringFragments.forEach(fragment => {
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
 * @param {String} newStyle 
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

export function filenameFromUrl(url){
	return url.split('/').pop().split('?')[0];
}

/**
 * Updates all the settings in the GUI to match the current scene configuration.
 */
export function updateGuiFromCurrentSceneConfiguration(){

	// Get current scene configuration
	var currentConfiguration = SCENESTATE.getCurrentConfiguration();
	
	// Iterate over all elements by id and set their value
	// This updates sliders and checkboxes
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
	// Start by selecting all elements with the 'pbr1-onlyshowifmultivalued' attribute.
	// This attribute links the GUI element to a key in the scene configuration and only makes it show up if it is multivalued (for example, if there are multiple images).
	document.querySelectorAll("*[pbr1-onlyshowifmultivalued]").forEach((element) =>{

		// Get the value of the attribute to determine which key of the scene configuration must me multivalued for this element to be visible
		var targetConfigurationParameter = element.attributes['pbr1-onlyshowifmultivalued'].value;

		// Check if the target parameter exists and is multivalued, then update the CSS accordingly
		if( Array.isArray(currentConfiguration[targetConfigurationParameter]) && currentConfiguration[targetConfigurationParameter].length > 1){
			element.style.display="unset";
		}else{
			element.style.display="none";
		}

	});

	// Update dropdown options.
	// Start by selecting all elements with the 'pbr1-optionsource' attribute.
	// This attribute describes which key in the scene configuration should be used as the source for the display text inside the dropdown.
	document.querySelectorAll("*[pbr1-optionsource]").forEach((element) =>{

		// Reset the content
		element.innerHTML = '';
		
		// Get the scene configuration key from which the data should be pulled
		var targetConfigurationParameter = element.attributes['pbr1-onlyshowifmultivalued'].value;

		// Create new dropdown options
		for (let i = 0; i < currentConfiguration[targetConfigurationParameter].length; i++) {
			var opt = document.createElement('option');
			opt.value = i;
			opt.selected = currentConfiguration[element.attributes['pbr1-selectedsource'].value] == i;
			opt.innerHTML = currentConfiguration[targetConfigurationParameter][i];
			element.appendChild(opt);
		}
	});

}