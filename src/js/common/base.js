import * as THREE from '../threejs/three.module.js';
import * as CONSTANTS from './constants.js';
import * as SCENESTATE from './scenestate.js';
import * as MISC from "./misc.js"

// GLOBAL FUNCTIONS

/**
 * A small function assigned to the global window object that makes it possible to trigger scene configuration updates using inline JS.
 * @param {*} changedConfig 
 * @param {*} resetValues 
 */
window.PBR1_CHANGE = function(changedConfig,resetValues = false){
    var evt = new CustomEvent('PBR1_CHANGE',{"detail": {"changedConfiguration": changedConfig,"resetValues":resetValues}});
    document.dispatchEvent(evt);
}


// FUNCTIONS

/**
 * 
 */
function handleHashStringChange(updateFunction){
	var parsedHashString = MISC.parseHashString();
	MISC.updateWatermark(parsedHashString['watermark']);
	updateFunction(parsedHashString,CONSTANTS.fallback.default);
}

/**
 * 
 */
function handleGUIChange(e,updateFunction){

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

	initializationFunction();

	// Handle GUI changes
	document.addEventListener("PBR1_CHANGE",(e) => { 
		handleGUIChange(e,updateFunction)
	});
	
	// Handle changes in the hash
	window.addEventListener('hashchange', (e) =>{
		handleHashStringChange(updateFunction)
	});

	handleHashStringChange(updateFunction);

	animationFunction();

}