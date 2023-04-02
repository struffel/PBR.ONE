import * as THREE from "../threejs/three.module.js";
import * as RGBE_LOADER from '../threejs/RGBELoader.js';
import * as EXR_LOADER from '../threejs/EXRLoader.js';
import * as MISC from "../common/misc.js";
import * as LOADING from "../common/loading.js";

/**
 * Updates the environment of a given ThreeJS-scene.
 * This happens in multiple places and is therefore defined as its own dedicated function.
 */
export function updateSceneEnvironment(url,scene,renderer){

	var envFileUrl = url;
	var envFileName = MISC.filenameFromUrl(url);
	var envFileExtension = MISC.fileExtensionFromUrl(url);
	
	var envLoader = MISC.pickEnvLoader(envFileExtension);

	var loadingNote = new LOADING.LoadingNote(envFileName,envFileUrl);
	loadingNote.start();
	envLoader.load(envFileUrl, texture => {
		const gen = new THREE.PMREMGenerator(renderer);
		const envMap = gen.fromEquirectangular(texture).texture;
		scene.environment = envMap;
		scene.background = envMap;
		texture.dispose()
		gen.dispose()

		loadingNote.finish();
	},null,() =>{
		console.error("Environment could not be loaded from URL", envUrl);
		loadingNote.fail();
	});
}