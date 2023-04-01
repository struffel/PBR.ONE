import * as CONSTANTS from "./constants.js"

var defaultConfiguration = {}
var defaultConfigurationDefined = false;

var currentConfiguration = {};

var sceneElements = {};

function updateDebug(){
	window.PBR1_DEBUG_SCENESTATE={
		defaultConfiguration,
		currentConfiguration,
		sceneElements
	};
}


export function initializeDefaultConfiguration(newDefaultConfiguration){
	if(!defaultConfigurationDefined){
		defaultConfiguration = newDefaultConfiguration;
	}else{
		throw "Can't redefine default configuration.";
	}
	updateDebug();
}

export function getDefaultConfiguration(){
	return defaultConfiguration;
}

/**
 * Takes in changes to the scene configuration, processes them and returns the new current scene configuration.
 * @param {*} incomingConfiguration 
 * @param {*} fallbackType 
 * @returns 
 */
export function updateCurrentConfiguration(incomingConfiguration,fallbackType){

	switch (fallbackType) {
		case CONSTANTS.fallback.default:
			var newConfiguration = structuredClone(defaultConfiguration);
			break;
		case CONSTANTS.fallback.current:
			var newConfiguration = structuredClone(currentConfiguration);
			break;
		default:
			throw "Invalid fallback type while updating scene configuration";
	}

	for(var key in incomingConfiguration){
		newConfiguration[key] = incomingConfiguration[key];
	};

	currentConfiguration = newConfiguration;
	updateDebug();
	return currentConfiguration;
}

export function getCurrentConfiguration(){
	return currentConfiguration;
}

export function getSceneElement(key){
	return sceneElements[key];
}

export function registerSceneElement(key,element){
	if(sceneElements[key]){
		console.warn("An element has already been registered under this name.")
	}
	sceneElements[key] = element;
	updateDebug();
}