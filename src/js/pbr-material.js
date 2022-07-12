// VARIABLES AND CONSTANTS

const PBR1_SCENECONFIG = {
	"default":{
		"color_url" : null,
		"color_encoding" : "sRGB",
	
		"normal_url" : null,
		"normal_encoding" : "linear",
		"normal_scale" : 1.0,
		"normal_type" : "directx",
	
		"displacement_url" : null,
		"displacement_encoding" : "linear",
		"displacement_scale" : 0.01,
	
		"roughness_url" : null,
		"roughness_encoding" : "linear",
	
		"metalness_url" : null,
		"metalness_encoding" : "linear",
	
		"ambientocclusion_url" : null,
		"ambientocclusion_encoding" : "linear",
	
		"opacity_url" : null,
		"opacity_encoding" : "linear",
	
		"environment_url" : "./media/env-sunny.exr",
	
		"geometry_type" : "plane",
		"geometry_subdivisions" : 500,
	
		"scale_x" : 1.0,
		"scale_y" : 1.0
	},
	"current":{}
};

// FUNCTIONS

function updateScene(incomingSceneConfiguration,fallbackType){

	newSceneConfiguration = buildNewSceneConfiguration(incomingSceneConfiguration,fallbackType);
	
	// Test for changes in url and encoding

	for(var mapName in PBR1_THREEJSMAPPING.mapNames){

		if( PBR1_SCENECONFIG.current[`${mapName}_url`] != newSceneConfiguration[`${mapName}_url`]){
			if(newSceneConfiguration[`${mapName}_url`] != null){
				var texture = PBR1_ELEMENTS.textureLoader.load(newSceneConfiguration[`${mapName}_url`]);
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.encoding = PBR1_THREEJSMAPPING.encoding[newSceneConfiguration[`${mapName}_encoding`]];
				texture.repeat.set( 1, 1 );

				// Apply additional settings to ensure that the maps actually have an effect

				if(PBR1_THREEJSMAPPING.mapActiveSettings[mapName][0] != null){
					PBR1_ELEMENTS.mesh.material[PBR1_THREEJSMAPPING.mapActiveSettings[mapName][0]] = PBR1_THREEJSMAPPING.mapActiveSettings[mapName][1];
					console.log(PBR1_THREEJSMAPPING.mapActiveSettings[mapName][0]);
				}

			}else{

				// Apply additional settings to ensure that the missing map is replaced with a sensible default

				if(PBR1_THREEJSMAPPING.mapActiveSettings[mapName][0] != null){
					PBR1_ELEMENTS.mesh.material[PBR1_THREEJSMAPPING.mapInactiveSettings[mapName][0]] = PBR1_THREEJSMAPPING.mapInactiveSettings[mapName][1];
					console.log(PBR1_THREEJSMAPPING.mapActiveSettings[mapName][0]);
				}

				var texture = null;
			}

			PBR1_ELEMENTS.mesh.material[PBR1_THREEJSMAPPING.mapNames[mapName]] = texture;
			PBR1_ELEMENTS.mesh.material.needsUpdate = true;
		}
		else if( PBR1_SCENECONFIG.current[`${mapName}_encoding`] != newSceneConfiguration[`${mapName}_encoding`]){
			if(PBR1_ELEMENTS.mesh.material[PBR1_THREEJSMAPPING.mapNames[mapName]] != null){
				PBR1_ELEMENTS.mesh.material[PBR1_THREEJSMAPPING.mapNames[mapName]].encoding = PBR1_THREEJSMAPPING.encoding[newSceneConfiguration[`${mapName}_encoding`]];
			}
		}

	}

	// Set new geometry subdivisions

	if(PBR1_SCENECONFIG.current["geometry_subdivisions"] != newSceneConfiguration["geometry_subdivisions"] |  PBR1_SCENECONFIG.current["geometry_type"] != newSceneConfiguration["geometry_type"]){
		switch (newSceneConfiguration["geometry_type"]) {
			case "cube":
				PBR1_ELEMENTS.mesh.geometry = new THREE.BoxGeometry(1,1,1,newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"]);
				break;
			case "cylinder":
				PBR1_ELEMENTS.mesh.rotation.x = 0;
				PBR1_ELEMENTS.mesh.geometry = new THREE.CylinderGeometry(0.5,0.5,1,newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"]);
				break;
			case "sphere":
				PBR1_ELEMENTS.mesh.rotation.x = 0;
				PBR1_ELEMENTS.mesh.geometry = new THREE.SphereGeometry(0.5,newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"]);
				break;
			case "plane":
			default:
				PBR1_ELEMENTS.mesh.rotation.x = 0.75 * 2 * Math.PI;
				PBR1_ELEMENTS.mesh.geometry = new THREE.PlaneGeometry(1,1,newSceneConfiguration["geometry_subdivisions"],newSceneConfiguration["geometry_subdivisions"]);
				break;
		}
	}

	// Test for changes in displacement strength

	if(PBR1_SCENECONFIG.current["displacement_scale"] != newSceneConfiguration["displacement_scale"]){
		PBR1_ELEMENTS.mesh.material.displacementBias = newSceneConfiguration["displacement_scale"] / -2;
		PBR1_ELEMENTS.mesh.material.displacementScale = newSceneConfiguration["displacement_scale"];
	}

	// Set Environment

	if(PBR1_SCENECONFIG.current["environment_url"] != newSceneConfiguration["environment_url"]){

		if(newSceneConfiguration["environment_url"].endsWith(".hdr")){
			var envLoader = new THREE.RGBELoader();
		}else if(newSceneConfiguration["environment_url"].endsWith(".exr")){
			var envLoader = new THREE.EXRLoader();
		}
		
		envLoader.load(newSceneConfiguration["environment_url"], texture => {
			const gen = new THREE.PMREMGenerator(PBR1_ELEMENTS.renderer);
			const envMap = gen.fromEquirectangular(texture).texture;
			PBR1_ELEMENTS.scene.environment = envMap;
			PBR1_ELEMENTS.scene.background = envMap;
			texture.dispose()
			gen.dispose()
		});
		
	}

	// Normal map type

	if(PBR1_SCENECONFIG.current["normal_type"] != newSceneConfiguration["normal_type"] || PBR1_SCENECONFIG.current["normal_scale"] != newSceneConfiguration["normal_scale"]){
		PBR1_ELEMENTS.mesh.material.normalScale = new THREE.Vector2(newSceneConfiguration["normal_scale"],newSceneConfiguration["normal_scale"]).multiply(PBR1_THREEJSMAPPING.normalMapType[newSceneConfiguration["normal_type"]]);
	}

	PBR1_SCENECONFIG.current = structuredClone(newSceneConfiguration);
	updateGuiFromCurrentSceneConfiguration();
}

// SCENE SETUP

PBR1_ELEMENTS.scene = new THREE.Scene();

// camera
PBR1_ELEMENTS.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
PBR1_ELEMENTS.camera.position.z = 2;
PBR1_ELEMENTS.camera.position.y = 1;

// renderer
PBR1_ELEMENTS.renderer = new THREE.WebGLRenderer();
resizeRenderingArea();
PBR1_ELEMENTS.renderer.toneMapping = THREE.ACESFilmicToneMapping;
PBR1_ELEMENTS.renderer.outputEncoding = THREE.sRGBEncoding;

// preview object
PBR1_ELEMENTS.mesh = new THREE.Mesh( new THREE.PlaneGeometry(1,1,1,1), new THREE.MeshPhysicalMaterial() );
PBR1_ELEMENTS.scene.add(PBR1_ELEMENTS.mesh);

// orbit controls
PBR1_ELEMENTS.controls = new THREE.OrbitControls(PBR1_ELEMENTS.camera, PBR1_ELEMENTS.renderer.domElement)
PBR1_ELEMENTS.controls.enableDamping = true;

// texture loader
PBR1_ELEMENTS.textureLoader = new THREE.TextureLoader()

// default normal map settings
PBR1_ELEMENTS.mesh.material.transparent = true;

// START
main()