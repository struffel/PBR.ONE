import * as CONSTANTS from './constants.js';
import * as SCENE_CONFIGURATION from './scene-configuration.js';
import * as MISC from "./misc.js";
import * as GUI from "./gui.js";

/**
 * The main function that starts the preview.
 */
export function start(initializationFunction,updateFunction,animationFunction){

	// Run the supplied initializationFunction
	initializationFunction();

	// Handle GUI changes
	document.addEventListener("PBR1_CHANGE",(e) => { 
		GUI.handleGUIChangeEvent(e,updateFunction);
	});
	
	// Handle changes in the hash
	window.addEventListener('hashchange', (e) =>{
		var parsedHashString = MISC.parseHashString();
		var oldAndNew = SCENE_CONFIGURATION.updateConfiguration(parsedHashString,false);
		updateFunction(oldAndNew.old,oldAndNew.new);

		GUI.updateGuiFromCurrentSceneConfiguration();
	});


	// Perform the initial loading by simulating a change in the hashstring.
	var initConfiguration = MISC.parseHashString();
	var oldAndNew = SCENE_CONFIGURATION.updateConfiguration(initConfiguration,true);

	// Set defaults for GUI and watermark if none are contained in the initial configuration
	if(!SCENE_CONFIGURATION.getConfiguration().watermark_enable){
		SCENE_CONFIGURATION.updateConfiguration({'watermark_enable':0});
	}
	if(!SCENE_CONFIGURATION.getConfiguration().gui_enable){
		SCENE_CONFIGURATION.updateConfiguration({'gui_enable':1});
	}
	console.debug("Update scene",oldAndNew.old,oldAndNew.new);
	updateFunction(oldAndNew.old,oldAndNew.new);
	GUI.updateGuiFromCurrentSceneConfiguration();

	// Run the animation function for THREE.js, if supplied.
	// Not all views use this.
	if(animationFunction){
		animationFunction();
	}
}
