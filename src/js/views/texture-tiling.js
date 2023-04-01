// IMPORTS
import * as THREE from "../threejs/three.module.js";
import * as ORBIT_CONTROLS from '../threejs/OrbitControls.js';
import * as RGBE_LOADER from '../threejs/RGBELoader.js';
import * as EXR_LOADER from '../threejs/EXRLoader.js';
import * as BASE from "../common/base.js";
import * as SCENESTATE from "../common/scenestate.js";
import * as CONSTANTS from "../common/constants.js";
import * as MISC from "../common/misc.js";

SCENESTATE.initializeDefaultConfiguration({
	"texture_url" : [],
	"texture_name": [],
	"texture_index":0, // If texture_url is multivalued then this value keeps track of the currently selected index
	"texture_size":512
});


var targetDomElement, crosshairDomElement, mouseDown, backgroundPositionX, backgroundPositionY, backgroundSize;

var previousTouchX, previousTouchY;

function moveBackground(x,y){
	backgroundPositionX = backgroundPositionX + x;
	backgroundPositionY = backgroundPositionY + y;
	targetDomElement.style.backgroundPosition = `${backgroundPositionX + window.innerWidth/2}px ${backgroundPositionY + window.innerHeight/2}px`;
}

function scaleBackground(factor){
	backgroundSize = backgroundSize * factor;
	targetDomElement.style.backgroundSize = `${backgroundSize}px`;

	backgroundPositionY = backgroundPositionY * factor;
	backgroundPositionX = backgroundPositionX * factor;
	targetDomElement.style.backgroundPosition = `${backgroundPositionX + window.innerWidth/2}px ${backgroundPositionY + window.innerHeight/2}px`;
}

function updateCrosshairDisplay(){
	if(mouseDown){
		crosshairDomElement.style.opacity = 1;
	}else{
		crosshairDomElement.style.opacity = 0;
	}
}

function updateScene(incomingSceneConfiguration,fallbackType){

	// Load configurations
	var oldSceneConfiguration = SCENESTATE.getCurrentConfiguration();
	var newSceneConfiguration = SCENESTATE.updateCurrentConfiguration(incomingSceneConfiguration,fallbackType);

	// Set CSS Background
	targetDomElement.style.backgroundImage = `url('${newSceneConfiguration['texture_url'][newSceneConfiguration['texture_index']]}')`;

	MISC.updateGuiFromCurrentSceneConfiguration();
}

function initializeScene(){

	targetDomElement = document.querySelector('#renderer_target');
	crosshairDomElement = document.querySelector('#crosshair');
	mouseDown = false;
	backgroundPositionX = 0;
	backgroundPositionY = 0;
	backgroundSize = SCENESTATE.getDefaultConfiguration().texture_size;

	targetDomElement.addEventListener("mousedown", function(event) {
		mouseDown = true;
		updateCrosshairDisplay();
		
	});

	targetDomElement.addEventListener("mousemove", function(event) {
		if (mouseDown) {
			moveBackground(event.movementX,event.movementY);
		}
	});

	targetDomElement.addEventListener("mouseup", function() {
		mouseDown = false;
		updateCrosshairDisplay();
	});

	document.addEventListener("wheel", function(event) {
		var factor = 1 + (event.deltaY * 0.001);
		scaleBackground(factor);
	});

	targetDomElement.addEventListener("touchstart", function(event) {
		mouseDown = true;
		updateCrosshairDisplay();
		previousTouchX = event.changedTouches[0].clientX;
		previousTouchY = event.changedTouches[0].clientY;
	},{ passive: true});

	targetDomElement.addEventListener("touchmove", function(event) {
		var touchDeltaX = event.changedTouches[0].clientX - previousTouchX;
		var touchDeltaY = event.changedTouches[0].clientY - previousTouchY;
		moveBackground(touchDeltaX,touchDeltaY);
		previousTouchX = event.changedTouches[0].clientX;
		previousTouchY = event.changedTouches[0].clientY;
	},{ passive: true});

	targetDomElement.addEventListener("touchend", function() {
		mouseDown = false;
		updateCrosshairDisplay();
	});

	scaleBackground(1);
	moveBackground(0,0);
	
}

// MAIN
BASE.start(initializeScene,updateScene,null);