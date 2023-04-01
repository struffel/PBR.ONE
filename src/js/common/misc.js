/**
 * Gets the filename from a URL. Excludes any additional HTTP parameters.
 * @param {*} url 
 * @returns 
 */
export function filenameFromUrl(url){
	return url.split('/').pop().split('?')[0];
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