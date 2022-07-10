// VARIABLES AND CONSTANTS

let PBR1_SCENECONFIG = {
	"default" : {

		"spheres.enable" : 1,
	
		"environment.tonemapping" : "filmic",
		"environment.exposure" : 0.0,
		"environment.url" : "./media/env-riverbed.exr",
	},
	"current" : {}
}

// EVENT LISTENERS

// Zooming
document.addEventListener( 'mousewheel', (event) => {
    PBR1_ELEMENTS.camera.fov += event.deltaY/50;
	PBR1_ELEMENTS.camera.updateProjectionMatrix();
});


// FUNCTIONS

function updateScene(incomingSceneConfiguration,fallbackType){

	newSceneConfiguration = buildNewSceneConfiguration(incomingSceneConfiguration,fallbackType);

	// Exposure

	if(PBR1_SCENECONFIG.current["environment.exposure"] != newSceneConfiguration["environment.exposure"]){
		PBR1_ELEMENTS.renderer.toneMappingExposure = Math.pow(2,newSceneConfiguration["environment.exposure"]);
	}

	if(PBR1_SCENECONFIG.current["environment.tonemapping"] != newSceneConfiguration["environment.tonemapping"]){
		PBR1_ELEMENTS.renderer.toneMapping = PBR1_THREEJSMAPPING.toneMapping[newSceneConfiguration["environment.tonemapping"]];
	}

	if(PBR1_SCENECONFIG.current["spheres.enable"] != newSceneConfiguration["spheres.enable"]){
		PBR1_ELEMENTS.scene.visible = Boolean(newSceneConfiguration["spheres.enable"]);
	}

	// Set Environment

	if(PBR1_SCENECONFIG.current["environment.url"] != newSceneConfiguration["environment.url"]){

		if(newSceneConfiguration["environment.url"].endsWith(".hdr")){
			var envLoader = new THREE.RGBELoader();
		}else if(newSceneConfiguration["environment.url"].endsWith(".exr")){
			var envLoader = new THREE.EXRLoader();
		}
		
		envLoader.load(newSceneConfiguration["environment.url"], texture => {
			const gen = new THREE.PMREMGenerator(PBR1_ELEMENTS.renderer);
			const envMap = gen.fromEquirectangular(texture).texture;
			PBR1_ELEMENTS.scene.environment = envMap;
			PBR1_ELEMENTS.scene.background = envMap;
			texture.dispose()
			gen.dispose()

			PBR1_ELEMENTS.renderer.toneMappingExposure = Math.pow(2,newSceneConfiguration["environment.exposure"]);
			PBR1_ELEMENTS.renderer.toneMapping = PBR1_THREEJSMAPPING.toneMapping[newSceneConfiguration["environment.tonemapping"]];
		});
		
	}

	PBR1_SCENECONFIG.current = structuredClone(newSceneConfiguration);
}

// MAIN

PBR1_ELEMENTS.scene = new THREE.Scene();

// camera
PBR1_ELEMENTS.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
PBR1_ELEMENTS.camera.position.x = 2;
PBR1_ELEMENTS.camera.position.y = 1;

// preview objects
PBR1_ELEMENTS.diffuseSphere = new THREE.Mesh( 
	new THREE.SphereGeometry(0.33,128,128), 
	new THREE.MeshPhysicalMaterial({"color":0xFFFFFF}) 
);
PBR1_ELEMENTS.diffuseSphere.position.z = 1;

PBR1_ELEMENTS.glossySphere = new THREE.Mesh( 
	new THREE.SphereGeometry(0.33,128,128), 
	new THREE.MeshPhysicalMaterial({"color":0x116DD5,"roughness":0}) 
);
PBR1_ELEMENTS.glossySphere.position.z = 0;

PBR1_ELEMENTS.metallicSphere = new THREE.Mesh(
	new THREE.SphereGeometry(0.33,128,128), 
	new THREE.MeshPhysicalMaterial({"color":0xFFFFFF,"roughness":0,"metalness":1}) 
);
PBR1_ELEMENTS.metallicSphere.position.z = -1;

PBR1_ELEMENTS.scene.add(PBR1_ELEMENTS.diffuseSphere);
PBR1_ELEMENTS.scene.add(PBR1_ELEMENTS.glossySphere);
PBR1_ELEMENTS.scene.add(PBR1_ELEMENTS.metallicSphere);

// renderer
PBR1_ELEMENTS.renderer = new THREE.WebGLRenderer();
resizeRenderingArea();
PBR1_ELEMENTS.renderer.outputEncoding = THREE.sRGBEncoding;

// orbit controls
PBR1_ELEMENTS.controls = new THREE.OrbitControls(PBR1_ELEMENTS.camera, PBR1_ELEMENTS.renderer.domElement);
PBR1_ELEMENTS.controls.enableZoom = false;
PBR1_ELEMENTS.controls.enablePan = false;
PBR1_ELEMENTS.controls.enableDamping = true;


// rendering canvas
document.querySelector('main').appendChild( PBR1_ELEMENTS.renderer.domElement );

// start
animate();
updateScene(parseHashString(),PBR1_FALLBACK.default);