import * as SCENE_CONFIGURATION from "./scene-configuration.js";
import * as CONSTANTS from "./constants.js";

/**
 * Handles a GUI change event and runs the supplied update function.
 */
export function handleGUIChangeEvent(event,updateFunction){
	console.debug("Received PBR1_CHANGE event: ",event);

	// TODO: Test if the GUI demands a reset!

	var changedConfiguration = event.detail.changedConfiguration;
	var resetRequested = event.detail.resetValues;
	var oldAndNew = SCENE_CONFIGURATION.updateConfiguration(changedConfiguration,resetRequested ? CONSTANTS.updateMode.resetSelected : CONSTANTS.updateMode.extendCurrent);
	updateFunction(oldAndNew.old,oldAndNew.new);
	updateGuiFromCurrentSceneConfiguration();
}

/**
 * A small function assigned to the global window object that makes it possible to trigger scene configuration updates using inline JS.
 * It is added to the window object to make it accessible everywhere, even outside module code.
 * @param {*} changedConfig 
 * @param {*} resetValues 
 */
window.PBR1_CHANGE = function(changedConfig,resetValues = false){
    var event = new CustomEvent('PBR1_CHANGE',{"detail": {"changedConfiguration": changedConfig,"resetValues":resetValues}});
	console.debug("Dispatched PBR1_CHANGE event: ",event);
    document.dispatchEvent(event);
}

/**
 * Updates all the settings in the GUI to match the current scene configuration.
 */
export function updateGuiFromCurrentSceneConfiguration(){
	// Get current scene configuration
	var currentConfiguration = SCENE_CONFIGURATION.getConfiguration();
	console.debug("Update GUI from scene configuration: ",currentConfiguration);

	if(currentConfiguration.gui_enable){
		var guiEnable = currentConfiguration.gui_enable[0];
	}else{
		var guiEnable = 0;
	}
	
	var navGuiEnableLabel = document.querySelector('#gui_enable_label');
	var navFull = document.querySelector('nav');
	var navMainElements = document.querySelector('.nav-main-elements');

	// Update Gui display
	switch (guiEnable) {
		default:
		case '1':
			navFull.style.height = "unset";
			navMainElements.style.height = "unset";
			if(navGuiEnableLabel)navGuiEnableLabel.innerHTML = "Hide GUI";
			break;
		
		case '0':
			navFull.style.height = "unset";
			navMainElements.style.height = 0;
			if(navGuiEnableLabel)navGuiEnableLabel.innerHTML = "Show GUI";
			break;

		case '-1':
			navFull.style.height = 0;
			break;
	}
	
	
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

	// Set the new watermark CSS class
	var newWatermarkClass = "watermark ";
	switch (currentConfiguration.watermark_enable[0]) {
		case '0':
			newWatermarkClass += "watermark-off";
			break;
		case '1':
			newWatermarkClass += "watermark-small";
			break;
		case '2':
		default:
			newWatermarkClass += "watermark-large";
			break;
	}
	document.querySelector('.watermark').setAttribute("class",newWatermarkClass);


}