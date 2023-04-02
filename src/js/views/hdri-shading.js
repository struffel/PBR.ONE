// IMPORTS
import * as THREE from "../threejs/three.module.js";
import * as ORBIT_CONTROLS from '../threejs/OrbitControls.js';
import * as MISC from '../common/misc.js';
import * as GUI from '../common/gui.js';
import * as BASE from "../common/base.js";
import * as SCENESTATE from "../common/scenestate.js";
import * as CONSTANTS from "../common/constants.js";
import * as SCENEACTION from "../common/sceneactions.js"


// VARIABLES AND CONSTANTS

SCENESTATE.initializeDefaultConfiguration({

	"spheres_enable" : 1,

	"environment_tonemapping" : "filmic",
	"environment_exposure" : 0.0,

	"environment_url" : ["./media/env-full-riverbed-lq.exr"],
	"environment_name": [],
	"environment_index":0

});

// FUNCTIONS

function updateScene(incomingSceneConfiguration,fallbackType){

	// Load configurations
	var oldSceneConfiguration = SCENESTATE.getCurrentConfiguration();
	var newSceneConfiguration = SCENESTATE.updateCurrentConfiguration(incomingSceneConfiguration,fallbackType);

	// Load scene components
	var renderer = SCENESTATE.getSceneElement("RENDERER");
	var scene = SCENESTATE.getSceneElement("SCENE");

	// Exposure
	renderer.toneMappingExposure = Math.pow(2,newSceneConfiguration["environment_exposure"]);
	renderer.toneMapping = CONSTANTS.toneMapping[newSceneConfiguration["environment_tonemapping"]];

	// Show spheres
	scene.visible = Boolean(parseInt(newSceneConfiguration["spheres_enable"]));

	// Set Environment
	var envIndexChanged = oldSceneConfiguration.environment_index != newSceneConfiguration.environment_index;
	var envUrlChanged = !MISC.arrayEquals(
		MISC.toArray(oldSceneConfiguration["environment_url"]),
		MISC.toArray(newSceneConfiguration["environment_url"])
	);

	if( envIndexChanged || envUrlChanged){
		var envFileUrl = MISC.toArray(newSceneConfiguration["environment_url"])[newSceneConfiguration.environment_index];
		SCENEACTION.updateSceneEnvironment(envFileUrl,scene,renderer);
	}


	//PBR1_SCENECONFIG.current = structuredClone(newSceneConfiguration);
	GUI.updateGuiFromCurrentSceneConfiguration();
}

function initializeScene(){

	// scene
	var scene = new THREE.Scene();
	SCENESTATE.registerSceneElement("SCENE",scene);

	// camera
	var camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.x = 2;
	camera.position.y = 1;
	SCENESTATE.registerSceneElement("CAMERA",camera);

	// preview objects
	var diffuseSphere = new THREE.Mesh( 
		new THREE.SphereGeometry(0.33,128,128), 
		new THREE.MeshPhysicalMaterial({"color":0xFFFFFF}) 
	);
	diffuseSphere.position.z = 1;

	var glossySphere = new THREE.Mesh( 
		new THREE.SphereGeometry(0.33,128,128), 
		new THREE.MeshPhysicalMaterial({"color":0x116DD5,"roughness":0}) 
	);
	glossySphere.position.z = 0;

	var metallicSphere = new THREE.Mesh(
		new THREE.SphereGeometry(0.33,128,128), 
		new THREE.MeshPhysicalMaterial({"color":0xFFFFFF,"roughness":0,"metalness":1}) 
	);
	metallicSphere.position.z = -1;

	scene.add(diffuseSphere);
	scene.add(glossySphere);
	scene.add(metallicSphere);

	// renderer
	var renderer = new THREE.WebGLRenderer();
	BASE.resizeRenderingArea(camera,renderer);
	renderer.outputEncoding = CONSTANTS.encoding.sRGB;
	SCENESTATE.registerSceneElement("RENDERER",renderer);

	// orbit controls
	var controls = new ORBIT_CONTROLS.OrbitControls(camera, renderer.domElement);
	controls.enableZoom = true;
	controls.minDistance = controls.maxDistance = 2;
	controls.enablePan = false;
	controls.enableDamping = true;
	SCENESTATE.registerSceneElement("CONTROLS",controls);

	// Window resizing
	window.addEventListener('resize', (e) => { BASE.resizeRenderingArea(camera,renderer)}, false);

	// Zoom
	var zoomHandler = function(event,camera) {
		camera.fov = Math.min(Math.max(camera.fov + event.deltaY/50, 1), 150);
		camera.updateProjectionMatrix();
	}
	document.addEventListener( 'mousewheel', (e) =>{zoomHandler(e,camera)});

	// Set up renderer
	document.querySelector('#renderer_target').appendChild( renderer.domElement );
	
}

function animate() {
    requestAnimationFrame( animate );
	SCENESTATE.getSceneElement("CONTROLS").update();
    SCENESTATE.getSceneElement("RENDERER").render( SCENESTATE.getSceneElement("SCENE"), SCENESTATE.getSceneElement("CAMERA") );
}

BASE.start(initializeScene,updateScene,animate);