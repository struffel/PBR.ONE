// VARIABLES AND CONSTANTS

let scene, camera, renderer,  mesh, controls, textureLoader, normalMapMode;

const defaultSceneConfiguration = {
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
};

const threeMapNames = { 
	"color"			: "map",
	"normal"		: "normalMap",
	"roughness"		: "roughnessMap",
	"displacement"	: "displacementMap",
	"metalness"		: "metalnessMap",
	"opacity"		: "alphaMap"
}

const threeEncodings = {
	"sRGB": THREE.sRGBEncoding,
	"linear": THREE.LinearEncoding
}

const threeNormalMapType = {
	"opengl"	: new THREE.Vector2(1,1),
	"directx"	: new THREE.Vector2(1,-1)
}

// STATE

// Change some initial values so that the update mechanism becomes active
let currentSceneConfiguration = {};

// EVENT LISTENERS

// Changes in the hash
window.addEventListener('hashchange', function() { 
	updateSceneConfiguration(parseHashString(),true);
});

// Window resizing
window.addEventListener('resize', resizeRenderingArea, false)
function resizeRenderingArea() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// FUNCTIONS

function parseHashString(){
	var hashString = window.location.href.substring(window.location.href.indexOf('#') + 1);;
	var hashStringFragments = hashString.split(',');

	var output = {};

	hashStringFragments.forEach(fragment => {
		keyValue = fragment.split('=');
		output[keyValue[0]] = keyValue[1];
	});

	return output;
}

function updateSceneConfiguration(incomingSceneConfiguration,fallbackToDefault){

	if(fallbackToDefault){
		newSceneConfiguration = structuredClone(defaultSceneConfiguration);
	}else{
		newSceneConfiguration = structuredClone(currentSceneConfiguration);
	}

	
	for(var key in incomingSceneConfiguration){
		if(newSceneConfiguration[key] !== undefined){
			newSceneConfiguration[key] = incomingSceneConfiguration[key];
		}
	};
	
	// Test for changes in url and encoding

	for(var mapName in threeMapNames){

		if( currentSceneConfiguration[`${mapName}.url`] != newSceneConfiguration[`${mapName}.url`]){
			if(newSceneConfiguration[`${mapName}.url`] != null){
				var texture = textureLoader.load(newSceneConfiguration[`${mapName}.url`]);
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.encoding = threeEncodings[newSceneConfiguration[`${mapName}.encoding`]];
				texture.repeat.set( 1, 1 );
			}else{
				var texture = null;
			}

			mesh.material[threeMapNames[mapName]] = texture;
			mesh.material.needsUpdate = true;
		}
		else if( currentSceneConfiguration[`${mapName}.encoding`] != newSceneConfiguration[`${mapName}.encoding`]){
			if(mesh.material[threeMapNames[mapName]] != null){
				mesh.material[threeMapNames[mapName]].encoding = threeEncodings[newSceneConfiguration[`${mapName}.encoding`]];
			}
		}

	}

	// Set new geometry subdivisions

	if(currentSceneConfiguration["geometry.subdivisions"] != newSceneConfiguration["geometry.subdivisions"] |  currentSceneConfiguration["geometry.type"] != newSceneConfiguration["geometry.type"]){
		switch (newSceneConfiguration["geometry.type"]) {
			case "cube":
				mesh.geometry = new THREE.BoxGeometry(1,1,1,newSceneConfiguration["geometry.subdivisions"],newSceneConfiguration["geometry.subdivisions"],newSceneConfiguration["geometry.subdivisions"]);
				break;
			case "cylinder":
				mesh.rotation.x = 0;
				mesh.geometry = new THREE.CylinderGeometry(0.5,0.5,1,newSceneConfiguration["geometry.subdivisions"],newSceneConfiguration["geometry.subdivisions"]);
				break;
			case "sphere":
				mesh.rotation.x = 0;
				mesh.geometry = new THREE.SphereGeometry(0.5,newSceneConfiguration["geometry.subdivisions"],newSceneConfiguration["geometry.subdivisions"]);
				break;
			case "plane":
			default:
				mesh.rotation.x = 0.75 * 2 * Math.PI;
				mesh.geometry = new THREE.PlaneGeometry(1,1,newSceneConfiguration["geometry.subdivisions"],newSceneConfiguration["geometry.subdivisions"]);
				break;
		}
	}

	// Test for changes in displacement strength

	if(currentSceneConfiguration["displacement.scale"] != newSceneConfiguration["displacement.scale"]){
		mesh.material.displacementBias = newSceneConfiguration["displacement.scale"] / -2;
		mesh.material.displacementScale = newSceneConfiguration["displacement.scale"];
	}

	// Set Environment

	if(currentSceneConfiguration["environment.url"] != newSceneConfiguration["environment.url"]){
		new THREE.RGBELoader().load(newSceneConfiguration["environment.url"], texture => {
			const gen = new THREE.PMREMGenerator(renderer);
			const envMap = gen.fromEquirectangular(texture).texture;
			scene.environment = envMap;
			scene.background = envMap;
			texture.dispose()
			gen.dispose()
		});
	}

	// Normal map type

	if(currentSceneConfiguration["normal.type"] != newSceneConfiguration["normal.type"] || currentSceneConfiguration["normal.scale"] != newSceneConfiguration["normal.scale"]){
		mesh.material.normalScale = new THREE.Vector2(newSceneConfiguration["normal.scale"],newSceneConfiguration["normal.scale"]).multiply(threeNormalMapType[newSceneConfiguration["normal.type"]]);
	}

	currentSceneConfiguration = structuredClone(newSceneConfiguration);
}

function animate() {
    requestAnimationFrame( animate );
	controls.update();
    renderer.render( scene, camera );
}

// SCENE SETUP

scene = new THREE.Scene();

// camera
camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 2;
camera.position.y = 1;

// renderer
renderer = new THREE.WebGLRenderer();
resizeRenderingArea();
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

// preview object
mesh = new THREE.Mesh( new THREE.PlaneGeometry(1,1,1,1), new THREE.MeshPhysicalMaterial() );
scene.add(mesh);

// orbit controls
controls = new THREE.OrbitControls(camera, renderer.domElement)

// texture loader
textureLoader = new THREE.TextureLoader()

// default normal map settings
mesh.material.transparent = true;

// rendering canvas
document.querySelector('main').appendChild( renderer.domElement );

// start
animate();
updateSceneConfiguration(parseHashString(),true);