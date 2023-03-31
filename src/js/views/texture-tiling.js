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



var targetDomElement;
var isMouseDown;
var basePositionX;
var basePositionY;
var baseSize;

function moveBackground(x,y){
	basePositionX = basePositionX + x;
	basePositionY = basePositionY + y;
	targetDomElement.style.backgroundPosition = `${basePositionX + window.innerWidth/2}px ${basePositionY + window.innerHeight/2}px`;
}

function scaleBackground(factor){
	baseSize = baseSize * factor;
	targetDomElement.style.backgroundSize = `${baseSize}px`;

	basePositionY = basePositionY * factor;
	basePositionX = basePositionX * factor;
	targetDomElement.style.backgroundPosition = `${basePositionX + window.innerWidth/2}px ${basePositionY + window.innerHeight/2}px`;
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
	isMouseDown = false;
	basePositionX = 0;
	basePositionY = 0;
	baseSize = SCENESTATE.getDefaultConfiguration().texture_size;

	targetDomElement.addEventListener("mousedown", function(event) {
		isMouseDown = true;
	});

	targetDomElement.addEventListener("mousemove", function(event) {
		if (isMouseDown) {
			moveBackground(event.movementX,event.movementY);
		}
	});

	targetDomElement.addEventListener("mouseup", function() {
		isMouseDown = false;
	});

	document.addEventListener("wheel", function(event) {
		var factor = 1 + (event.deltaY * 0.001);
		scaleBackground(factor);
	});

	/*targetDomElement.addEventListener("touchstart", function(event) {
		isMouseDown = true;
		startX = event.touches[0].clientX;
		startY = event.touches[0].clientY;
	});

	targetDomElement.addEventListener("touchmove", function(event) {
	if (isMouseDown) {
		currentX = event.touches[0].clientX;
		currentY = event.touches[0].clientY;
		targetDomElement.style.left = (targetDomElement.offsetLeft - (startX - currentX)) + "px";
		targetDomElement.style.top = (targetDomElement.offsetTop - (startY - currentY)) + "px";
		startX = currentX;
		startY = currentY;
	}
	});

	targetDomElement.addEventListener("touchend", function() {
		isMouseDown = false;
	});*/

	scaleBackground(1);
	moveBackground(0,0);
	

}

// MAIN
BASE.start(initializeScene,updateScene,null);