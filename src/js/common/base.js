import * as THREE from '../threejs/three.module.js';
import * as CONSTANTS from './constants.js';
import * as SCENESTATE from './scenestate.js';
import * as MISC from "./misc.js";
import * as GUI from "./gui.js";

/**
 * Re-parses the current hashstring and runs the updateFunction supplied to it.
 * @param {*} updateFunction 
 */
function handleHashStringChange(updateFunction){
	var parsedHashString = MISC.parseHashString();
	GUI.updateWatermark(parsedHashString['watermark_enable']);
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
 * A small function assigned to the global window object that makes it possible to trigger scene configuration updates using inline JS.
 * It is added to the window object to make it accessible everywhere, even outside module code.
 * @param {*} changedConfig 
 * @param {*} resetValues 
 */
window.PBR1_CHANGE = function(changedConfig,resetValues = false){
    var evt = new CustomEvent('PBR1_CHANGE',{"detail": {"changedConfiguration": changedConfig,"resetValues":resetValues}});
    document.dispatchEvent(evt);
}
