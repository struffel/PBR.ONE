import * as CONSTANTS from './constants.js';
import * as SCENE_CONFIGURATION from './scene-configuration.js';
import * as MISC from "./misc.js";
import * as GUI from "./gui.js";
import * as MESSAGE from "./message.js";

window.addEventListener("error", (event) => {
	new MESSAGE.newError("An error occured:",event.message);
},true);

/**
 * The main function that starts the preview.
 */
export function start(initializationFunction,preprocessingFunction,updateFunction,animationFunction){

	// Run the supplied initializationFunction
	initializationFunction();

	// Handle GUI changes
	document.addEventListener("PBR1_CHANGE",(e) => { 
		GUI.handleGUIChangeEvent(e,updateFunction);
	});
	
	// Handle changes in the hash
	window.addEventListener('hashchange', (e) =>{
		var parsedHashString = MISC.parseHashString();
		var oldAndNew = SCENE_CONFIGURATION.updateConfiguration(parsedHashString,CONSTANTS.updateMode.extendCurrent);

		// Perform preprocessing
		if(preprocessingFunction){
			oldAndNew.new = preprocessingFunction(oldAndNew.new);
		}

		updateFunction(oldAndNew.old,oldAndNew.new);

		GUI.updateGuiFromCurrentSceneConfiguration();
	});


	// Perform the initial loading by simulating a change in the hashstring.
	var initConfiguration = MISC.parseHashString();
	var oldAndNew = SCENE_CONFIGURATION.updateConfiguration(initConfiguration,CONSTANTS.updateMode.startFromFoundation);

	// Perform preprocessing
	if(preprocessingFunction){
		oldAndNew.new = preprocessingFunction(oldAndNew.new);
	}

	// Set defaults for GUI and watermark if none are contained in the initial configuration
	if(!SCENE_CONFIGURATION.getConfiguration().watermark_enable){
		SCENE_CONFIGURATION.updateConfiguration({'watermark_enable':0},CONSTANTS.updateMode.extendCurrent);
	}
	if(!SCENE_CONFIGURATION.getConfiguration().gui_enable){
		SCENE_CONFIGURATION.updateConfiguration({'gui_enable':1},CONSTANTS.updateMode.extendCurrent);
	}
	console.debug("Updating scene (old,new): ",oldAndNew.old,oldAndNew.new);
	updateFunction(oldAndNew.old,oldAndNew.new);
	GUI.updateGuiFromCurrentSceneConfiguration();

	// Run the animation function for THREE.js, if supplied.
	// Not all views use this.
	if(animationFunction){
		animationFunction();
	}
}
