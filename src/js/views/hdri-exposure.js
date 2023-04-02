// IMPORTS
import * as THREE from "../threejs/three.module.js";
import * as MISC from '../common/misc.js';
import * as RGBE_LOADER from '../threejs/RGBELoader.js';
import * as EXR_LOADER from '../threejs/EXRLoader.js';
import * as BASE from "../common/base.js";
import * as SCENESTATE from "../common/scenestate.js";
import * as CONSTANTS from "../common/constants.js";
import * as LOADING from "../common/loading.js";
import * as GUI from "../common/gui.js";


// VARIABLES AND CONSTANTS

var scene, renderer, camera, previewPlane,controls;

SCENESTATE.initializeDefaultConfiguration({
	"environment_tonemapping" : "linear",
	"environment_exposure" : 0.0,
	"environment_url" : ["./media/env-full-riverbed-lq.exr"],
	"environment_name": [],
	"environment_index":0
});
console.info("Initialized default configuration",SCENESTATE.getDefaultConfiguration());

/**
 * Function to adjust the aspect ratio of the final image by changing the camera's "coverage area".
 */
function adjustAspectRatio(){

	var windowAspect = window.innerWidth / window.innerHeight;
	var imageAspect = previewPlane.scale.x / previewPlane.scale.y;

	if(camera){
		if(windowAspect > imageAspect){
			camera.left = -windowAspect;
			camera.right = windowAspect;
			camera.bottom = -1;
			camera.top = 1;
		}else{
			camera.left = -imageAspect;
			camera.right = imageAspect;
			camera.bottom =-imageAspect/windowAspect;
			camera.top = imageAspect/windowAspect;
		}
		camera.updateProjectionMatrix();
	}
}

/**
 * Gets called whenever changes to the scne configuration are detected in order to implement the changes.
 * @param {*} incomingSceneConfiguration 
 * @param {CONSTANTS.fallbackType} fallbackType Defines the behavior if a value is not set in the incomingSceneConfiguration.
 */
function updateScene(incomingSceneConfiguration,fallbackType){
	console.info("Processing changes in the scene configuration",incomingSceneConfiguration,fallbackType);

	// Load configurations
	var oldSceneConfiguration = SCENESTATE.getCurrentConfiguration();
	var newSceneConfiguration = SCENESTATE.updateCurrentConfiguration(incomingSceneConfiguration,fallbackType);
	console.debug("Old scene configuration is:",oldSceneConfiguration);
	console.debug("New scene configuration is:",newSceneConfiguration);

	// Exposure
	renderer.toneMappingExposure = Math.pow(2,newSceneConfiguration.environment_exposure);
	renderer.toneMapping = CONSTANTS.toneMapping[newSceneConfiguration.environment_tonemapping];
	
	// Set Environment
	var envIndexChanged = oldSceneConfiguration.environment_index != newSceneConfiguration.environment_index;
	console.debug("Environment Index changed?",envIndexChanged);

	var envUrlChanged = !MISC.arrayEquals(
		MISC.toArray(oldSceneConfiguration.environment_url),
		MISC.toArray(newSceneConfiguration.environment_url)
	);
	console.debug("Environment URL changed?",envIndexChanged);
	
	if(envIndexChanged || envUrlChanged){
		var envUrl = MISC.toArray(newSceneConfiguration["environment_url"])[newSceneConfiguration.environment_index];
		console.info("New environment will be loaded from URL",envUrl);

		var loadingNote = new LOADING.LoadingNote(MISC.filenameFromUrl(envUrl),envUrl);
		loadingNote.start();
		try{
			var extension = MISC.fileExtensionFromUrl(envUrl);
			var envLoader = MISC.pickEnvLoader(extension);

			envLoader.load(envUrl, texture => {
				console.info("Successfully loaded environment from URL", envUrl);
				previewPlane.material.map = texture;
				previewPlane.scale.x = previewPlane.material.map.image.width / previewPlane.material.map.image.height;
				previewPlane.scale.y = 1;
				previewPlane.material.needsUpdate = true;
				adjustAspectRatio();
				texture.dispose()

				// Reload exposure and tone mapping settings
				renderer.toneMappingExposure = Math.pow(2,newSceneConfiguration["environment_exposure"]);
				renderer.toneMapping = CONSTANTS.toneMapping[newSceneConfiguration["environment_tonemapping"]];

				loadingNote.finish();
			},null,() =>{
				console.error("Environment could not be loaded from URL", envUrl);
				loadingNote.fail();
			});
		}catch(e){
			loadingNote.fail();
			throw e;
		}
		
	}

	GUI.updateGuiFromCurrentSceneConfiguration();
}

/**
 * Performs the initial scene setup.
 */
function initializeScene(){
	scene = new THREE.Scene();
	previewPlane = new THREE.Mesh(
		new THREE.PlaneGeometry(2,2),
		new THREE.MeshBasicMaterial({"color":0xFFFFFF})
	);

	previewPlane.material.side = THREE.DoubleSide;
	window.previewPlane = previewPlane;
	scene.add(previewPlane);

	camera = new THREE.OrthographicCamera( -1, 1, 1, -1 , 0, 100 );
	camera.position.z = 1;

	renderer = new THREE.WebGLRenderer();
	renderer.outputEncoding = CONSTANTS.encoding.sRGB;

	BASE.resizeRenderingArea(camera,renderer);

	// Window resizing event listeners
	window.addEventListener('resize', (e) => { BASE.resizeRenderingArea(camera,renderer)}, false);
	window.addEventListener('resize', adjustAspectRatio, false);

	// Activate renderer
	document.querySelector('#renderer_target').appendChild( renderer.domElement );

}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

// START
BASE.start(initializeScene,updateScene,animate);