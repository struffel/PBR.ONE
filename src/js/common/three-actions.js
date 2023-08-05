import * as THREE from "../threejs/three.module.js";
import * as RGBE_LOADER from '../threejs/RGBELoader.js';
import * as EXR_LOADER from '../threejs/EXRLoader.js';
import * as MISC from "./misc.js";
import * as LOADING from "./loading.js";

/**
 * Updates the environment of a given ThreeJS-scene.
 * This happens in multiple places and is therefore defined as its own dedicated function.
 */
export function updateSceneEnvironment(url,scene,renderer){
	console.debug("Updating scene environment (url): ",url);

	var envFileUrl = url;
	var envFileName = MISC.filenameFromUrl(url);
	
	var loadingNote = new LOADING.LoadingNote(envFileName,envFileUrl);
	loadingNote.start();
	
	try{
		var envFileExtension = MISC.fileExtensionFromUrl(url);
		var envLoader = pickEnvLoader(envFileExtension);

		envLoader.load(envFileUrl, texture => {
			const gen = new THREE.PMREMGenerator(renderer);
			const envMap = gen.fromEquirectangular(texture).texture;
			scene.environment = envMap;
			scene.background = envMap;
			texture.dispose()
			gen.dispose()
			
			loadingNote.finish();
		},null,(error) =>{
			loadingNote.fail(error);
		});
	}catch(error){
		loadingNote.fail(error);
	}

	
}

/**
 * 
 * @param {*} extension 
 * @returns 
 */
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