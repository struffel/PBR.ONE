import * as CONSTANTS from "./constants.js"

var defaultConfiguration = {
	"watermark_enable":['2'],
	"gui_enable":['1']
};

var defaultDefinied = false;
var currentConfiguration;

/**
 * 
 * @param {*} newDefaultConfiguration 
 */
export function initializeConfiguration(newDefaultConfiguration){
	if(!defaultDefinied){
		currentConfiguration = {};
		console.debug("Initialize scene",newDefaultConfiguration);

		for(const key in newDefaultConfiguration){
			defaultConfiguration[key] = [].concat(newDefaultConfiguration[key]);
		}

		console.debug("Default is now:", defaultConfiguration);
		console.debug("Current is now:",currentConfiguration);
		defaultDefinied = true;
	}else{
		throw "Can't redefine default configuration.";
	}
}

/**
 * Takes in changes to the scene configuration, processes them and returns the new current scene configuration.
 * @param {*} configurationChanges 
 * @param {Boolean} startFromDefault 
 * @returns 
 */
export function updateConfiguration(configurationChanges,startFromDefault = false){

	console.debug("Update configuration with changes",configurationChanges,startFromDefault);

	var oldConfiguration = currentConfiguration;

	if(startFromDefault){
		var newConfiguration = structuredClone(defaultConfiguration);
	}else{
		var newConfiguration = structuredClone(currentConfiguration);
	}

	for(const key in configurationChanges){
		newConfiguration[key] = [].concat(configurationChanges[key]);
	};

	currentConfiguration = newConfiguration;

	console.debug("Configuration updated",currentConfiguration);

	return {
		old:oldConfiguration,
		new:newConfiguration
	};
}

/**
 * 
 * @returns 
 */
export function getConfiguration(){
	return currentConfiguration;
}

/**
 * Tests if two scene configurations have the same values for all their fields at one specific key.
 */
export function equalAtKey(a, b,key) {
	var result = Array.isArray(a[key]) &&
		Array.isArray(b[key]) &&
		a[key].length === b[key].length &&
	  	a[key].every((val, index) => val === b[key][index]);

	console.debug(`Configurations identical for key "${key}"?`,result);
	return result;
}