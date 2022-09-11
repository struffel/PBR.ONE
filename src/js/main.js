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
window.addEventListener('hashchange', updateSiteFromHashstring);

// Window resizing
window.addEventListener('resize', resizeRenderingArea, false);
function resizeRenderingArea() {

	if(PBR1_ELEMENTS.camera && PBR1_ELEMENTS.renderer){
		PBR1_ELEMENTS.camera.aspect = window.innerWidth / window.innerHeight;
		PBR1_ELEMENTS.camera.updateProjectionMatrix();
		PBR1_ELEMENTS.renderer.setSize(window.innerWidth, window.innerHeight);
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
			if(Array.isArray(newSceneConfiguration[key])){
				newSceneConfiguration[key] = incomingSceneConfiguration[key].split(";");
			}else{
				newSceneConfiguration[key] = incomingSceneConfiguration[key];
			}
			
		}
	};

    return newSceneConfiguration;
}

function updateGuiFromCurrentSceneConfiguration(){

	// Iterate over all elements by id and set their value
	for(var key in PBR1_SCENECONFIG.current){
		var target = document.getElementById(key)
		if(target != null && target.value != undefined){
			target.value = PBR1_SCENECONFIG.current[key];
		}
		if(target != null && target.checked != undefined){
			target.checked = Boolean(parseInt(PBR1_SCENECONFIG.current[key]));
		}
	}


	// Show or hide nav elements that are only necessary for multivalued inputs (like choosing multiple maps/materials).
	// Select all Elements with the 'pbr1-onlyshowifmultivalued' attribute
	document.querySelectorAll("*[pbr1-onlyshowifmultivalued]").forEach((element) =>{
		// Get the value of the attribute to determine which key of the scene configuration must me multivalued for this element to be visible
		var targetConfigurationParameter = element.attributes['pbr1-onlyshowifmultivalued'].value;

		// Check if the target parameter exists and is multivalued

		if( Array.isArray(PBR1_SCENECONFIG.current[targetConfigurationParameter]) && PBR1_SCENECONFIG.current[targetConfigurationParameter].length > 1){
			element.style.display="unset";
		}else{
			element.style.display="none";
		}

	});


	//Update dropdown options
	document.querySelectorAll("*[pbr1-optionsource]").forEach((element) =>{
		element.innerHTML = '';
		var targetConfigurationParameter = element.attributes['pbr1-onlyshowifmultivalued'].value;
		for (let i = 0; i < PBR1_SCENECONFIG.current[targetConfigurationParameter].length; i++) {
			var opt = document.createElement('option');
			opt.value = i;
			opt.selected = PBR1_SCENECONFIG.current[element.attributes['pbr1-selectedsource'].value] == i;
			opt.innerHTML = PBR1_SCENECONFIG.current[targetConfigurationParameter][i];
			element.appendChild(opt);
		}
	});

}

function arrayEquals(a, b) {
	return Array.isArray(a) &&
	  Array.isArray(b) &&
	  a.length === b.length &&
	  a.every((val, index) => val === b[index]);
}

function updateWatermark(newStyle){
	var newWatermarkClass = "watermark ";
	switch (newStyle) {
		case 'off':
			newWatermarkClass += "watermark-off";
			break;
		case 'small':
			newWatermarkClass += "watermark-small";
			break;
		case 'large':
			newWatermarkClass += "watermark-large";
			break;
		default:
			console.log("default");
			newWatermarkClass += "watermark-large";
			break;
	}
	document.querySelector('.watermark').setAttribute("class",newWatermarkClass);
}

function animate() {
    requestAnimationFrame( animate );
	PBR1_ELEMENTS.controls.update();
    PBR1_ELEMENTS.renderer.render( PBR1_ELEMENTS.scene, PBR1_ELEMENTS.camera );
}

function updateSiteFromHashstring(){
	var hashString = parseHashString();
	updateWatermark(hashString['watermark']);
	updateScene(hashString,PBR1_FALLBACK.default);
}

function main(){
	document.querySelector('#renderer_target').appendChild( PBR1_ELEMENTS.renderer.domElement );
	animate();
	updateSiteFromHashstring();
}