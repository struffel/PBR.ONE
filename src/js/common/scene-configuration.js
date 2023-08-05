import * as CONSTANTS from "./constants.js";

var foundationalConfiguration = {
	"watermark_enable":['2'],
	"gui_enable":['1']
};

var defaultDefinied = false;
var currentConfiguration;

/**
 * 
 * @param {*} newFoundationalConfiguration 
 */
export function initializeConfiguration(newFoundationalConfiguration){
	if(!defaultDefinied){
		currentConfiguration = {};
		console.debug("Initializing scene (newFoundationalConfiguration): ",newFoundationalConfiguration);

		for(const key in newFoundationalConfiguration){
			foundationalConfiguration[key] = [].concat(newFoundationalConfiguration[key]);
		}

		console.debug("Initialized scene (foundationalConfiguration,currentConfiguration): ", foundationalConfiguration,currentConfiguration);
		defaultDefinied = true;
	}else{
		throw "Can't redefine foundational configuration.";
	}
}

export function resetConfigurationKey(key){
	currentConfiguration[key] = foundationalConfiguration[key];
	return currentConfiguration[key];
}

/**
 * Takes in changes to the scene configuration, processes them and returns the new current scene configuration.
 * @param {*} configurationChanges 
 * @param {CONSTANTS.updateMode} startFromFoundation 
 * @param {Boolean} resetValues Reset the keys supplied on the 'configurationChanges' object to their default value.
 * @returns 
 */
export function updateConfiguration(configurationChanges,mode){

	console.debug("Update configuration with changes (configurationChanges,mode): ",configurationChanges,mode);

	var oldConfiguration = currentConfiguration;

	switch (mode) {
		case CONSTANTS.updateMode.extendCurrent:
			var newConfiguration = structuredClone(currentConfiguration);
			for(const key in configurationChanges){
				newConfiguration[key] = [].concat(configurationChanges[key]);
			};
			break;
		case CONSTANTS.updateMode.resetSelected:
			var newConfiguration = structuredClone(currentConfiguration);
			for(const key in configurationChanges){
				newConfiguration[key] = [].concat(foundationalConfiguration[key]);
			};
			break;
		case CONSTANTS.updateMode.startFromFoundation:
			var newConfiguration = structuredClone(foundationalConfiguration);
			for(const key in configurationChanges){
				newConfiguration[key] = [].concat(configurationChanges[key]);
			};
			break;
		default:
			throw new Error("Invalid update mode.");
			break;
	}

	currentConfiguration = newConfiguration;

	console.debug("Configuration updated (currentConfiguration): ",currentConfiguration);

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

	console.debug("Configurations identical for key (key,result): ",key,result);
	return result;
}