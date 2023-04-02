import * as EXR_LOADER from "../threejs/EXRLoader.js";
import * as RGBE_LOADER from "../threejs/RGBELoader.js";

/**
 * Gets the filename from a URL. Excludes any additional HTTP parameters.
 * @param {*} url 
 * @returns 
 */
export function filenameFromUrl(url){
	return url.split('/').pop().split('?')[0];
}

/**
 * Gets the file extension out of a URL.
 * @param {String} url 
 * @returns {String} The file extension of the file behind the URL
 */
export function fileExtensionFromUrl(url){
	return url.split(/[#?]/)[0].split('.').pop().trim();
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
 * Function to turn a single object into an array with one item.
 * Does nothing if an existing array is passed to it.
 * @param {any} input 
 * @returns 
 */
export function toArray(input){
	return [].concat(input);
}

export function pickEnvLoader(extension){
	switch (extension) {
		case "hdr":
			var envLoader = new RGBE_LOADER.RGBELoader();
			console.debug("Using RGBELoader (.hdr)");
			break;
		case "exr":
			var envLoader = new EXR_LOADER.EXRLoader();
			console.debug("Using EXRLoader (.exr)");
			break;
		default:
			throw new Error(`Could not determine a fitting resource loader (exr/hdr) for URL extension '${extension}'`);
			break;
	}
	return envLoader;
}