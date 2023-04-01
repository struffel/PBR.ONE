// IMPORTS
import * as THREE from "../threejs/three.module.js";
import * as ORBIT_CONTROLS from '../threejs/OrbitControls.js';
import * as RGBE_LOADER from '../threejs/RGBELoader.js';
import * as EXR_LOADER from '../threejs/EXRLoader.js';
import * as BASE from "../common/base.js";
import * as SCENESTATE from "../common/scenestate.js";
import * as CONSTANTS from "../common/constants.js";
import * as LOADING from "../common/loading.js";


// VARIABLES AND CONSTANTS

var scene, renderer, camera, previewPlane,controls;

SCENESTATE.initializeDefaultConfiguration({
	"environment_tonemapping" : "linear",
	"environment_exposure" : 0.0,
	"environment_url" : ["./media/env-full-riverbed-lq.exr"],
	"environment_name": [],
	"environment_index":0
});

// EVENT LISTENERS

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

	// Load configurations
	var oldSceneConfiguration = SCENESTATE.getCurrentConfiguration();
	var newSceneConfiguration = SCENESTATE.updateCurrentConfiguration(incomingSceneConfiguration,fallbackType);

	// Exposure
	renderer.toneMappingExposure = Math.pow(2,newSceneConfiguration.environment_exposure);
	renderer.toneMapping = CONSTANTS.toneMapping[newSceneConfiguration.environment_tonemapping];

	
	// Set Environment
	if(oldSceneConfiguration.environment_index != newSceneConfiguration.environment_index ||
		!BASE.arrayEquals(oldSceneConfiguration.environment_url,newSceneConfiguration.environment_url)){

		var envUrl = newSceneConfiguration["environment_url"][newSceneConfiguration.environment_index];
		
		if(envUrl.split("?")[0].split("#")[0].endsWith(".hdr")){
			var envLoader = new RGBE_LOADER.RGBELoader();
		}else if(envUrl.split("?")[0].split("#")[0].endsWith(".exr")){
			var envLoader = new EXR_LOADER.EXRLoader();
		}
		
		var loadingNote = new LOADING.LoadingNote(BASE.filenameFromUrl(envUrl),envUrl);
		loadingNote.start();

		envLoader.load(envUrl, texture => {
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
		});
		
	}

	BASE.updateGuiFromCurrentSceneConfiguration();
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

	window.scene = scene;

	//camera = new THREE.PerspectiveCamera();
	camera = new THREE.OrthographicCamera( -1, 1, 1, -1 , 0, 100 );
	camera.position.z = 1;

	window.camera = camera;

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

// orbit controls
//PBR1_ELEMENTS.controls = {update:function(){}};

// START
BASE.start(initializeScene,updateScene,animate);