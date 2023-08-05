// IMPORTS
import * as THREE from "../threejs/three.module.js";
import * as MISC from '../common/misc.js';
import * as BASE from "../common/base.js";
import * as SCENE_CONFIGURATION from "../common/scene-configuration.js";
import * as CONSTANTS from "../common/constants.js";
import * as LOADING from "../common/loading.js";
import * as GUI from "../common/gui.js";
import * as THREE_ACTIONS from '../common/three-actions.js';
import * as MESSAGE from "../common/message.js";


// VARIABLES AND CONSTANTS

var scene, renderer, camera, previewPlane;

function preprocessSceneConfiguration(sceneConfiguration){

	// No environment specified
	if(sceneConfiguration.environment_url.length == 0){
		sceneConfiguration.environment_url = ["./media/env-placeholder.exr"];
		sceneConfiguration.environment_name = ["Placeholder"];
	}

	// More URLs than names
	if(sceneConfiguration.environment_url.length > sceneConfiguration.environment_name.length && sceneConfiguration.environment_url.length > 1){
		MESSAGE.newWarning("Not all environments have a name.");
		sceneConfiguration.environment_name = MISC.padArray(sceneConfiguration.environment_name,sceneConfiguration.environment_url.length,"Unnamed HDRI");
	}

	// More names than URLs
	else if(sceneConfiguration.environment_url.length < sceneConfiguration.environment_name.length){
		MESSAGE.newWarning("More env. names than URLs have been defined.")
		sceneConfiguration.environment_name = sceneConfiguration.environment_name.slice(0,sceneConfiguration.environment_url.length);
	}

	return sceneConfiguration;
}

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
function updateScene(oldSceneConfiguration,newSceneConfiguration){

	// Exposure
	renderer.toneMappingExposure = Math.pow(2,newSceneConfiguration.environment_exposure);
	renderer.toneMapping = CONSTANTS.toneMapping[newSceneConfiguration.environment_tonemapping];
	
	// Set Environment
	var envIndexChanged = !SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"environment_index");

	var envUrlChanged = !SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"environment_url");
	
	if( envIndexChanged || envUrlChanged ){
		var envUrl = newSceneConfiguration["environment_url"][newSceneConfiguration.environment_index];
		console.debug("New environment will be loaded (envUrl): ",envUrl);

		var loadingNote = new LOADING.LoadingNote(MISC.filenameFromUrl(envUrl),envUrl);
		loadingNote.start();
		try{
			var extension = MISC.fileExtensionFromUrl(envUrl);
			var envLoader = THREE_ACTIONS.pickEnvLoader(extension);

			envLoader.load(envUrl, texture => {
				console.debug("Successfully loaded environment (envUrl): ", envUrl);
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
			},null,(error) =>{
				console.error("Environment could not be loaded (envUrl): ", envUrl);
				loadingNote.fail(error);
			});
		}catch(error){
			loadingNote.fail(error);
		}
		
	}

	GUI.updateGuiFromCurrentSceneConfiguration();
}

/**
 * Performs the initial scene setup.
 */
function initializeScene(){

	SCENE_CONFIGURATION.initializeConfiguration({
		"environment_tonemapping" : "linear",
		"environment_exposure" : 0.0,
		"environment_url" : [],
		"environment_name": [],
		"environment_index":0
	});

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

	

	// Window resizing event listeners
	window.addEventListener('resize', (e) => { THREE_ACTIONS.resizeRenderingArea(camera,renderer)}, false);
	window.addEventListener('resize', adjustAspectRatio, false);
	window.addEventListener('mousedown', (e) => { THREE_ACTIONS.resizeRenderingArea(camera,renderer)}, false);
	window.addEventListener('touchstart', (e) => { THREE_ACTIONS.resizeRenderingArea(camera,renderer)}, false);

	// Activate renderer
	document.querySelector('#renderer_target').appendChild( renderer.domElement );
	THREE_ACTIONS.resizeRenderingArea(camera,renderer);
	

}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

// START
BASE.start(initializeScene,preprocessSceneConfiguration,updateScene,animate);