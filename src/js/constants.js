export const PBR1_FALLBACK = {
    "default":0,
    "current":1
}

export const PBR1_THREEJSMAPPING = {
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

	// These are the settings for ThreeJS if a specific map is active.
	// This ensures, for example, that the metalness property is always actually active (set to 1) if a metalness map is used.
    // Otherwise it might get multiplied by zero, which effectively disables it.
	mapActiveSettings : {
		"color" : ["color",new THREE.Color( 0xffffff )],
		"normal": [null,null],
		"roughness":["roughness",1],
		"displacement":[null,null],
		"metalness":["metalness",1],
		"opacity":["opacity",1]
	},

    // These are the settings to use for ThreeJS if a specific map is inactive.
    // This ensures a consistent "default" look.
	mapInactiveSettings: {
		"color" : ["color",new THREE.Color( 0xdddddd )],
		"normal": [null,null],
		"roughness":["roughness",0.5],
		"displacement":[null,null],
		"metalness":["metalness",0],
		"opacity":["opacity",1]
	},

    // A wrapper for the ThreeJS encoding types
    encoding : {
        "sRGB": THREE.sRGBEncoding,
        "linear": THREE.LinearEncoding
    },

    // The two common normal map interpretations.
    // The vectors define how the R and G values of the normal map should be read.
    // In the DirectX-Case the green channel needs to be flipped.
    normalMapType : {
        "opengl"	: new THREE.Vector2(1,1),
        "directx"	: new THREE.Vector2(1,-1)
    }
}