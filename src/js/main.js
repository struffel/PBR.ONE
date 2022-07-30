// CONSTANTS

let PBR1_ELEMENTS = {};

const PBR1_FALLBACK = {
    "default":0,
    "current":1
}

const PBR1_THREEJSMAPPING = {
    toneMapping: {
        "linear" : THREE.LinearToneMapping,
	    "filmic" : THREE.ACESFilmicToneMapping
    },
    mapNames : { 
        "color"			: "map",
        "normal"		: "normalMap",
        "roughness"		: "roughnessMap",
        "displacement"	: "displacementMap",
        "metalness"		: "metalnessMap",
        "opacity"		: "alphaMap"
    },

	// These are the "base" settings for ThreeJS if a specific map is active.
	// This ensures, for example, that the metalness property is always actually active (set to 1) if a metalness map is used.
	mapActiveSettings : {
		"color" : ["color",new THREE.Color( 0xffffff )],
		"normal": [null,null],
		"roughness":["roughness",1],
		"displacement":[null,null],
		"metalness":["metalness",1],
		"opacity":["opacity",1]
	},
	mapInactiveSettings: {
		"color" : ["color",new THREE.Color( 0xdddddd )],
		"normal": [null,null],
		"roughness":["roughness",0.5],
		"displacement":[null,null],
		"metalness":["metalness",0],
		"opacity":["opacity",1]
	},
    encoding : {
        "sRGB": THREE.sRGBEncoding,
        "linear": THREE.LinearEncoding
    },
    normalMapType : {
        "opengl"	: new THREE.Vector2(1,1),
        "directx"	: new THREE.Vector2(1,-1)
    }
}

// EVENT LISTENERS

// Changes in the hash
window.addEventListener('hashchange', function() { 
	updateScene(parseHashString(),false);
});

// Window resizing
window.addEventListener('resize', resizeRenderingArea, false);
function resizeRenderingArea() {

	if(PBR1_SCENECONFIG.internal.aspect == null){
		var aspect = window.innerWidth / window.innerHeight;
		var sizeX = window.innerWidth;
		var sizeY = window.innerHeight;
	}else{
		var aspect =  PBR1_SCENECONFIG.internal.aspect;
		var sizeX = Math.min(window.innerWidth,window.innerHeight/aspect);
		var sizeY = Math.min(window.innerWidth*aspect,window.innerHeight);
	}
	if(PBR1_ELEMENTS.camera && PBR1_ELEMENTS.renderer){
		PBR1_ELEMENTS.camera.aspect = aspect;
		PBR1_ELEMENTS.camera.updateProjectionMatrix();
		PBR1_ELEMENTS.renderer.setSize(sizeX, sizeY);
	}
	
}

// FUNCTIONS

function parseHashString(){
	var hashString = window.location.href.substring(window.location.href.indexOf('#') + 1);
	var hashStringFragments = hashString.split(',');

	var output = {};

	hashStringFragments.forEach(fragment => {
		keyValue = fragment.split('=');
		output[keyValue[0]] = keyValue[1];
	});

	return output;
}

function buildNewSceneConfiguration(incomingSceneConfiguration,fallbackType){
    if(fallbackType == PBR1_FALLBACK.default){
		newSceneConfiguration = structuredClone(PBR1_SCENECONFIG.default);
	}else if(fallbackType == PBR1_FALLBACK.current){
		newSceneConfiguration = structuredClone(PBR1_SCENECONFIG.current);
	}else{
        throw "Invalid fallback type for scene configuration."
    }
	
	
	for(var key in incomingSceneConfiguration){
		if(newSceneConfiguration[key] !== undefined){
			newSceneConfiguration[key] = incomingSceneConfiguration[key];
		}
	};

    return newSceneConfiguration;
}

function updateGuiFromCurrentSceneConfiguration(){
	for(var key in PBR1_SCENECONFIG.current){
		var target = document.getElementById(key)
		if(target != null && target.value != undefined){
			target.value = PBR1_SCENECONFIG.current[key];
		}
		if(target != null && target.checked != undefined){
			target.checked = Boolean(parseInt(PBR1_SCENECONFIG.current[key]));
		}
	}
}

function animate() {
    requestAnimationFrame( animate );
	PBR1_ELEMENTS.controls.update();
    PBR1_ELEMENTS.renderer.render( PBR1_ELEMENTS.scene, PBR1_ELEMENTS.camera );
}

function main(){
	document.querySelector('#renderer_target').appendChild( PBR1_ELEMENTS.renderer.domElement );
	animate();
	updateScene(parseHashString(),PBR1_FALLBACK.default);
}