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
 * Parses the hash string and returns a list of key-value pairs from it.
 * @returns 
 */
export function parseHashString(){
	var hashString = window.location.hash.substring(1);

	console.debug("Parsing hashstring (hashString): ", hashString);

	if(hashString == ""){
		return {};
	}

	var output = {}
	var searchParams = new URLSearchParams(hashString);
	
	for (const key of searchParams.keys()) {
		output[key] = searchParams.get(key).split(",");
	}

	return output;
}

export function padArray(array,length,fill) {
	return array.concat(Array(length).fill(fill)).slice(0,length);
}