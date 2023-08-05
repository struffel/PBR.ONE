import * as THREE from "../threejs/three.module.js";
import * as ORBIT_CONTROLS from '../threejs/OrbitControls.js';
import * as MISC from '../common/misc.js';
import * as BASE from "../common/base.js";
import * as SCENE_CONFIGURATION from "../common/scene-configuration.js";
import * as CONSTANTS from "../common/constants.js";
import * as THREE_ACTIONS from "../common/three-actions.js";
import * as LOADINGNOTE from "../common/loading.js";
import * as MESSAGE from "../common/message.js";

var scene, camera, renderer, mesh, controls, textureLoader;

function preprocessSceneConfiguration(sceneConfiguration){

	// No environment specified, use default
	if(sceneConfiguration.environment_url.length == 0 && sceneConfiguration.environment_name.length == 0){
		sceneConfiguration.environment_url = ["./media/env-studio-lq.exr","./media/env-dune-lq.exr","./media/env-forest-lq.exr","./media/env-field-lq.exr","./media/env-lab-lq.exr","./media/env-night-lq.exr"];
		sceneConfiguration.environment_name = ["Studio","Dune","Forest","Field","Computer Lab","Night"];
	}

	// Environment Index too high
	if(sceneConfiguration.environment_index >= sceneConfiguration.environment_url.length){
		sceneConfiguration.environment_index = 0;
	}

	// More environment URLs than names
	if(sceneConfiguration.environment_url.length > sceneConfiguration.environment_name.length && sceneConfiguration.environment_url.length > 1){
		MESSAGE.newWarning("Not all environments have a name.");
		sceneConfiguration.environment_name = MISC.padArray(sceneConfiguration.environment_name,sceneConfiguration.environment_url.length,"Unnamed HDRI");
	}

	// More environment  names than URLs
	else if(sceneConfiguration.environment_url.length < sceneConfiguration.environment_name.length){
		MESSAGE.newWarning("More env. names than URLs have been defined.");
		sceneConfiguration.environment_name = sceneConfiguration.environment_name.slice(0,sceneConfiguration.environment_url.length);
	}

	// More materials than names
	var numberOfMaterials = 0;
	[
		sceneConfiguration.color_url,
		sceneConfiguration.normal_url,
		sceneConfiguration.displacement_url,
		sceneConfiguration.roughness_url,
		sceneConfiguration.opacity_url,
		sceneConfiguration.ambientocclusion_url
	].forEach((a) => {
		numberOfMaterials = Math.max(numberOfMaterials,a.length);
	});

	var numberOfMaterialNames = sceneConfiguration.material_name.length;

	if(numberOfMaterials > numberOfMaterialNames && numberOfMaterials > 1){
		MESSAGE.newWarning("More env. names than URLs have been defined.");
		sceneConfiguration.material_name = MISC.padArray(sceneConfiguration.material_name,sceneConfiguration.material_url.length,"Unnamed Material");
	}

	// More names than materials

	if(numberOfMaterials < numberOfMaterialNames){
		MESSAGE.newWarning("More env. names than URLs have been defined.");
		sceneConfiguration.material_name = sceneConfiguration.material_name.slice(0,numberOfMaterials);
	}

	if(sceneConfiguration.material_index >= numberOfMaterials){
		sceneConfiguration.material_index = 0;
	}

	return sceneConfiguration;
}

function updateScene(oldSceneConfiguration,newSceneConfiguration){

	// Set new geometry subdivisions and type
	if(!SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"geometry_subdivisions") || !SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"geometry_type")){
		switch (newSceneConfiguration["geometry_type"][0]) {
			case "cube":
				mesh.geometry = new THREE.BoxGeometry(1,1,1,newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"]);
				mesh.material.side = THREE.FrontSide;
				mesh.rotation.x = 0;
				mesh.rotation.y = 0;
				mesh.rotation.z = 0;
				break;
			case "cylinder":
				mesh.geometry = new THREE.CylinderGeometry(0.5,0.5,1,newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"],true);
				mesh.material.side = THREE.DoubleSide;
				mesh.rotation.x = 0;
				mesh.rotation.y = Math.PI;
				mesh.rotation.z = 0;
				break;
			case "sphere":
				
				mesh.geometry = new THREE.SphereGeometry(0.5,newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"]);
				mesh.material.side = THREE.FrontSide;
				mesh.rotation.x = 0;
				mesh.rotation.y = 0;
				mesh.rotation.z = 0;
				break;
			case "torus":
				
				mesh.geometry = new THREE.TorusGeometry(0.5,0.25,newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"]);
				mesh.material.side = THREE.FrontSide;
				mesh.rotation.x = 0.5 * Math.PI;
				mesh.rotation.y = 0;
				mesh.rotation.z = 0;
				break;
			case "plane":
			default:
				
				mesh.geometry = new THREE.PlaneGeometry(1,1,newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"]);
				mesh.material.side = THREE.DoubleSide;
				mesh.rotation.x = 1.5 * Math.PI;
				mesh.rotation.y = 0;
				mesh.rotation.z = 0;
				break;
		}
	}

	var tilingScaleRatioFactor = 1;
	switch (newSceneConfiguration["geometry_type"][0]) {
		case "cube":
			tilingScaleRatioFactor = 1;
			break;
		case "cylinder":
			tilingScaleRatioFactor = 1/Math.PI;
			break;
		case "sphere":
			tilingScaleRatioFactor = 0.5;
			break;
		case "torus":
			tilingScaleRatioFactor = 0.5;
			break;
		case "plane":
		default:
			tilingScaleRatioFactor = 1;
			break;
	}
	console.debug("Tiling scale ratio factor defined (tilingScaleRatioFactor): ",tilingScaleRatioFactor);

	// Test for changes in url and encoding
	for(var mapName in CONSTANTS.mapNames){

		var oldMapUrl = (oldSceneConfiguration[`${mapName}_url`] ?? [])[oldSceneConfiguration['material_index']];
		var newMapUrl = (newSceneConfiguration[`${mapName}_url`] ?? [])[newSceneConfiguration['material_index']];

		if(mapName == "color" && newSceneConfiguration.clayrender_enable[0]){
			newMapUrl = null;
		}

		if( oldMapUrl != newMapUrl || (mapName == "color" && !SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"clayrender_enable") ) ){
			if(newMapUrl){
				var loadingNote = new LOADINGNOTE.LoadingNote(MISC.filenameFromUrl(newMapUrl),newMapUrl);
				loadingNote.start();

				var texture = textureLoader.load(newMapUrl,function(texture){
					var ratio = texture.source.data.width / texture.source.data.height * tilingScaleRatioFactor;
					if(ratio > 1){
						texture.repeat.set( parseFloat(newSceneConfiguration.tiling_scale), parseFloat(newSceneConfiguration.tiling_scale) * ratio );
					}else{
						texture.repeat.set( parseFloat(newSceneConfiguration.tiling_scale) / ratio, parseFloat(newSceneConfiguration.tiling_scale) );
					}
					texture.loadingNote.finish();
				});
				texture.loadingNote = loadingNote;
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.encoding = CONSTANTS.encoding[newSceneConfiguration[`${mapName}_encoding`]];
				
				// Apply additional settings to ensure that the maps actually have an effect
				// (like setting the object color to white to avoid a color tint on the texture)
				if(CONSTANTS.mapActiveSettings[mapName][0] != null){
					mesh.material[CONSTANTS.mapActiveSettings[mapName][0]] = CONSTANTS.mapActiveSettings[mapName][1];
				}
			}
			else{
				// Apply additional settings to ensure that the missing map is replaced with a sensible default
				if(CONSTANTS.mapActiveSettings[mapName][0] != null){
					mesh.material[CONSTANTS.mapInactiveSettings[mapName][0]] = CONSTANTS.mapInactiveSettings[mapName][1];
				}

				var texture = null;
			}

			mesh.material[CONSTANTS.mapNames[mapName]] = texture;
			mesh.material.needsUpdate = true;
		}


		if( !SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"tiling_scale") || !SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"geometry_type")){
			if(mesh.material[CONSTANTS.mapNames[mapName]] != null && mesh.material[CONSTANTS.mapNames[mapName]].source != null && mesh.material[CONSTANTS.mapNames[mapName]].source.data != null){
				var ratio = mesh.material[CONSTANTS.mapNames[mapName]].source.data.width / mesh.material[CONSTANTS.mapNames[mapName]].source.data.height * tilingScaleRatioFactor;
				if(ratio > 1){
					mesh.material[CONSTANTS.mapNames[mapName]].repeat.set( parseFloat(newSceneConfiguration.tiling_scale)  , parseFloat(newSceneConfiguration.tiling_scale) * ratio );
				}else{
					mesh.material[CONSTANTS.mapNames[mapName]].repeat.set( parseFloat(newSceneConfiguration.tiling_scale)  / ratio, parseFloat(newSceneConfiguration.tiling_scale)  );
				}	
			}
		}
		
		if( oldSceneConfiguration[`${mapName}_encoding`] != newSceneConfiguration[`${mapName}_encoding`]){
			if(mesh.material[CONSTANTS.mapNames[mapName]] != null){
				mesh.material[CONSTANTS.mapNames[mapName]].encoding = CONSTANTS.encoding[newSceneConfiguration[`${mapName}_encoding`]];
			}
		}

	}

	

	// Test for changes in displacement strength

	if(oldSceneConfiguration["displacement_scale"] != newSceneConfiguration["displacement_scale"]){
		mesh.material.displacementBias = newSceneConfiguration["displacement_scale"] / -2;
		mesh.material.displacementScale = newSceneConfiguration["displacement_scale"];
	}

	// Set Environment

	if(!SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"environment_index") || !SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"environment_url")){

		THREE_ACTIONS.updateSceneEnvironment(newSceneConfiguration["environment_url"][newSceneConfiguration["environment_index"]],scene,renderer);
		
	}

	// Normal map type
	
	if(!SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"normal_type") || !SCENE_CONFIGURATION.equalAtKey(oldSceneConfiguration,newSceneConfiguration,"normal_scale")){
		mesh.material.normalScale = new THREE.Vector2(newSceneConfiguration["normal_scale"],newSceneConfiguration["normal_scale"]).multiply(CONSTANTS.normalMapType[newSceneConfiguration["normal_type"]]);
	}
	
}

function initializeScene(){

	SCENE_CONFIGURATION.initializeConfiguration({
		"color_url" : [],
		"color_encoding" : "sRGB",
	
		"normal_url" : [],
		"normal_encoding" : "linear",
		"normal_scale" : 1.0,
		"normal_type" : "opengl",
	
		"displacement_url" : [],
		"displacement_encoding" : "linear",
		"displacement_scale" : 0.01,
	
		"roughness_url" : [],
		"roughness_encoding" : "linear",
	
		"metalness_url" : [],
		"metalness_encoding" : "linear",
	
		"ambientocclusion_url" : [],
		"ambientocclusion_encoding" : "linear",
	
		"opacity_url" : [],
		"opacity_encoding" : "linear",
	
		"environment_url" : [],
		"environment_index":0,
		"environment_name":[],
	
		"geometry_type" : "plane",
		"geometry_subdivisions" : 500,
	
		"tiling_scale" : 1,
	
		"material_index":0,
		"material_name":[],
	
		"clayrender_enable":0
	});

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 2;
	camera.position.y = 1;

	renderer = new THREE.WebGLRenderer();
	renderer.toneMapping = CONSTANTS.toneMapping.filmic;
	renderer.outputEncoding = CONSTANTS.encoding.sRGB;

	mesh = new THREE.Mesh( new THREE.PlaneGeometry(1,1,1,1), new THREE.MeshPhysicalMaterial() );
	mesh.material.transparent = true;
	scene.add(mesh);

	controls = new ORBIT_CONTROLS.OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true;
	controls.listenToKeyEvents(window);

	textureLoader = new THREE.TextureLoader();
	THREE_ACTIONS.updateSceneEnvironment("./media/env-placeholder.exr",scene,renderer);

	// Window resizing
	window.addEventListener('resize', (e) => { THREE_ACTIONS.resizeRenderingArea(camera,renderer)}, false);
	window.addEventListener('mousedown', (e) => { THREE_ACTIONS.resizeRenderingArea(camera,renderer)}, false);
	window.addEventListener('touchstart', (e) => { THREE_ACTIONS.resizeRenderingArea(camera,renderer)}, false);

	// Set up renderer
	document.querySelector('#renderer_target').appendChild( renderer.domElement );
	THREE_ACTIONS.resizeRenderingArea(camera,renderer);

}

function animate() {
    requestAnimationFrame( animate );
	controls.update();
    renderer.render( scene, camera );
}

BASE.start(initializeScene,preprocessSceneConfiguration,updateScene,animate);