// VARIABLES AND CONSTANTS

const PBR1_SCENECONFIG = {
	"default":{
		"color.url" : null,
		"color.encoding" : "sRGB",
	
		"normal.url" : null,
		"normal.encoding" : "linear",
		"normal.scale" : 1.0,
		"normal.type" : "directx",
	
		"displacement.url" : null,
		"displacement.encoding" : "linear",
		"displacement.scale" : 0.05,
	
		"roughness.url" : null,
		"roughness.encoding" : "linear",
	
		"metalness.url" : null,
		"metalness.encoding" : "linear",
	
		"ambientocclusion.url" : null,
		"ambientocclusion.encoding" : "linear",
	
		"opacity.url" : null,
		"opacity.encoding" : "linear",
	
		"environment.url" : "https://cdn3.struffelproductions.com/file/ambientCG/media/panorama/OutdoorHDRI001_HDR.hdr",
	
		"geometry.type" : "plane",
		"geometry.subdivisions" : 500,
	
		//TODO
		"scale.x" : 1.0,
		"scale.y" : 1.0
	},
	"current":{}
};

// FUNCTIONS

function updateScene(incomingSceneConfiguration,fallbackType){

	newSceneConfiguration = buildNewSceneConfiguration(incomingSceneConfiguration,fallbackType);
	
	// Test for changes in url and encoding

	for(var mapName in PBR1_THREEJSMAPPING.mapNames){

		if( PBR1_SCENECONFIG.current[`${mapName}.url`] != newSceneConfiguration[`${mapName}.url`]){
			if(newSceneConfiguration[`${mapName}.url`] != null){
				var texture = PBR1_ELEMENTS.textureLoader.load(newSceneConfiguration[`${mapName}.url`]);
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.encoding = PBR1_THREEJSMAPPING.encoding[newSceneConfiguration[`${mapName}.encoding`]];
				texture.repeat.set( 1, 1 );
			}else{
				var texture = null;
			}

			PBR1_ELEMENTS.mesh.material[PBR1_THREEJSMAPPING.mapNames[mapName]] = texture;
			PBR1_ELEMENTS.mesh.material.needsUpdate = true;
		}
		else if( PBR1_SCENECONFIG.current[`${mapName}.encoding`] != newSceneConfiguration[`${mapName}.encoding`]){
			if(PBR1_ELEMENTS.mesh.material[PBR1_THREEJSMAPPING.mapNames[mapName]] != null){
				PBR1_ELEMENTS.mesh.material[PBR1_THREEJSMAPPING.mapNames[mapName]].encoding = PBR1_THREEJSMAPPING.encoding[newSceneConfiguration[`${mapName}.encoding`]];
			}
		}

	}

	// Set new geometry subdivisions

	if(PBR1_SCENECONFIG.current["geometry.subdivisions"] != newSceneConfiguration["geometry.subdivisions"] |  PBR1_SCENECONFIG.current["geometry.type"] != newSceneConfiguration["geometry.type"]){
		switch (newSceneConfiguration["geometry.type"]) {
			case "cube":
				PBR1_ELEMENTS.mesh.geometry = new THREE.BoxGeometry(1,1,1,newSceneConfiguration["geometry.subdivisions"],newSceneConfiguration["geometry.subdivisions"],newSceneConfiguration["geometry.subdivisions"]);
				break;
			case "cylinder":
				PBR1_ELEMENTS.mesh.rotation.x = 0;
				PBR1_ELEMENTS.mesh.geometry = new THREE.CylinderGeometry(0.5,0.5,1,newSceneConfiguration["geometry.subdivisions"],newSceneConfiguration["geometry.subdivisions"]);
				break;
			case "sphere":
				PBR1_ELEMENTS.mesh.rotation.x = 0;
				PBR1_ELEMENTS.mesh.geometry = new THREE.SphereGeometry(0.5,newSceneConfiguration["geometry.subdivisions"],newSceneConfiguration["geometry.subdivisions"]);
				break;
			case "plane":
			default:
				PBR1_ELEMENTS.mesh.rotation.x = 0.75 * 2 * Math.PI;
				PBR1_ELEMENTS.mesh.geometry = new THREE.PlaneGeometry(1,1,newSceneConfiguration["geometry.subdivisions"],newSceneConfiguration["geometry.subdivisions"]);
				break;
		}
	}

	// Test for changes in displacement strength

	if(PBR1_SCENECONFIG.current["displacement.scale"] != newSceneConfiguration["displacement.scale"]){
		PBR1_ELEMENTS.mesh.material.displacementBias = newSceneConfiguration["displacement.scale"] / -2;
		PBR1_ELEMENTS.mesh.material.displacementScale = newSceneConfiguration["displacement.scale"];
	}

	// Set Environment

	if(PBR1_SCENECONFIG.current["environment.url"] != newSceneConfiguration["environment.url"]){
		new THREE.RGBELoader().load(newSceneConfiguration["environment.url"], texture => {
			const gen = new THREE.PMREMGenerator(PBR1_ELEMENTS.renderer);
			const envMap = gen.fromEquirectangular(texture).texture;
			PBR1_ELEMENTS.scene.environment = envMap;
			PBR1_ELEMENTS.scene.background = envMap;
			texture.dispose()
			gen.dispose()
		});
	}

	// Normal map type

	if(PBR1_SCENECONFIG.current["normal.type"] != newSceneConfiguration["normal.type"] || PBR1_SCENECONFIG.current["normal.scale"] != newSceneConfiguration["normal.scale"]){
		PBR1_ELEMENTS.mesh.material.normalScale = new THREE.Vector2(newSceneConfiguration["normal.scale"],newSceneConfiguration["normal.scale"]).multiply(PBR1_THREEJSMAPPING.normalMapType[newSceneConfiguration["normal.type"]]);
	}

	PBR1_SCENECONFIG.current = structuredClone(newSceneConfiguration);
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

// rendering canvas
document.querySelector('main').appendChild( PBR1_ELEMENTS.renderer.domElement );

// start
animate();
updateScene(parseHashString(),PBR1_FALLBACK.default);