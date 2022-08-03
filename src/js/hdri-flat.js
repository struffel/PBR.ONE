// VARIABLES AND CONSTANTS

const PBR1_SCENECONFIG = {
	"default" : {
		"environment_tonemapping" : "linear",
		"environment_exposure" : 0.0,
		"environment_url" : ["./media/env-riverbed.exr"],
		"environment_name": [],
		"environment_index":0
	},
	"current" : {},
	"internal":{
		"aspect": 0.5
	}
}

// EVENT LISTENERS


// FUNCTIONS

function updateScene(incomingSceneConfiguration,fallbackType){

	newSceneConfiguration = buildNewSceneConfiguration(incomingSceneConfiguration,fallbackType);

	// Exposure

	if(PBR1_SCENECONFIG.current["environment_exposure"] != newSceneConfiguration["environment_exposure"]){
		PBR1_ELEMENTS.renderer.toneMappingExposure = Math.pow(2,newSceneConfiguration["environment_exposure"]);
	}

	if(PBR1_SCENECONFIG.current["environment_tonemapping"] != newSceneConfiguration["environment_tonemapping"]){
		PBR1_ELEMENTS.renderer.toneMapping = PBR1_THREEJSMAPPING.toneMapping[newSceneConfiguration["environment_tonemapping"]];
	}

	if(PBR1_SCENECONFIG.current["spheres_enable"] != newSceneConfiguration["spheres_enable"]){
		PBR1_ELEMENTS.scene.visible = Boolean(parseInt(newSceneConfiguration["spheres_enable"]));
	}

	
	// Set Environment

	if(PBR1_SCENECONFIG.current.environment_index != newSceneConfiguration.environment_index || !arrayEquals(PBR1_SCENECONFIG.current["environment_url"],newSceneConfiguration["environment_url"])){

		if(newSceneConfiguration["environment_url"][newSceneConfiguration.environment_index].split("?")[0].split("#")[0].endsWith(".hdr")){
			var envLoader = new THREE.RGBELoader();
		}else if(newSceneConfiguration["environment_url"][newSceneConfiguration.environment_index].split("?")[0].split("#")[0].endsWith(".exr")){
			var envLoader = new THREE.EXRLoader();
		}
		
		envLoader.load(newSceneConfiguration["environment_url"][newSceneConfiguration.environment_index], texture => {
			PBR1_ELEMENTS.previewPlane.material.map = texture;
			PBR1_ELEMENTS.previewPlane.material.needsUpdate = true;
			texture.dispose()

			PBR1_ELEMENTS.renderer.toneMappingExposure = Math.pow(2,newSceneConfiguration["environment_exposure"]);
			PBR1_ELEMENTS.renderer.toneMapping = PBR1_THREEJSMAPPING.toneMapping[newSceneConfiguration["environment_tonemapping"]];
		});
		
	}

	PBR1_SCENECONFIG.current = structuredClone(newSceneConfiguration);
	updateGuiFromCurrentSceneConfiguration();
}

// MAIN

PBR1_ELEMENTS.scene = new THREE.Scene();

// Preview Plane
PBR1_ELEMENTS.previewPlane = new THREE.Mesh(
	new THREE.PlaneGeometry(2,1),
	new THREE.MeshBasicMaterial({"color":0xFFFFFF})
	);
PBR1_ELEMENTS.scene.add(PBR1_ELEMENTS.previewPlane);


// camera
const aspect = window.innerWidth / window.innerHeight;
PBR1_ELEMENTS.camera = new THREE.OrthographicCamera( -1, 1, 0.5, -0.5 , 0, 100 );
PBR1_ELEMENTS.camera.position.z = 1;



// renderer
PBR1_ELEMENTS.renderer = new THREE.WebGLRenderer();
resizeRenderingArea();
PBR1_ELEMENTS.renderer.outputEncoding = THREE.sRGBEncoding;

// orbit controls
PBR1_ELEMENTS.controls = {update:function(){}};

// START
main()