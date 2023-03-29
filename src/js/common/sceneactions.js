import * as THREE from "../threejs/three.module.js";
import * as RGBE_LOADER from '../threejs/RGBELoader.js';
import * as EXR_LOADER from '../threejs/EXRLoader.js';

/**
 * Updates the environment of a given ThreeJS-scene.
 */
export function updateSceneEnvironment(url,scene,renderer){

	// Decide which loader to use
	if(url.split("?")[0].split("#")[0].endsWith(".hdr")){
		var envLoader = new THREE.RGBELoader();
	}else if(url.split("?")[0].split("#")[0].endsWith(".exr")){
		var envLoader = new THREE.EXRLoader();
	}

	// Load the environment
	envLoader.load(url, texture => {
		const gen = new THREE.PMREMGenerator(renderer);
		const envMap = gen.fromEquirectangular(texture).texture;
		scene.environment = envMap;
		scene.background = envMap;
		texture.dispose();
		gen.dispose();
	});
}