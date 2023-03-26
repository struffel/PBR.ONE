import * as THREE from './threejs/three.module.js';
import * as CONSTANTS from './constants.js';
import * as SCENESTATE from './scenestate.js';
import * as MISC from "./misc.js"

// FUNCTIONS

/**
 * 
 */
function updateSiteFromHashstring(updateFunction){
	var hashString = MISC.parseHashString();
	//updateWatermark(hashString['watermark']);
	updateFunction(hashString,CONSTANTS.fallback.default);
}

/**
 * The main function that starts the preview.
 */
export function start(initializationFunction,updateFunction,animationFunction){

	initializationFunction();
	
	// Changes in the hash
	window.addEventListener('hashchange', updateSiteFromHashstring.bind(updateFunction));
	updateSiteFromHashstring(updateFunction);

	animationFunction();

}