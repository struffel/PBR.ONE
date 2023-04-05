// IMPORTS
import * as CONSTANTS from "../common/constants.js";
import * as BASE from "../common/base.js";
import * as SCENE_CONFIGURATION from "../common/scene-configuration.js";

var targetDomElement, mouseDown, backgroundPositionX, backgroundPositionY, backgroundSize, previousTouchX, previousTouchY;


function moveBackground(x,y){
	backgroundPositionX = backgroundPositionX + x;
	backgroundPositionY = backgroundPositionY + y;
	targetDomElement.style.backgroundPosition = `${backgroundPositionX + window.innerWidth/2}px ${backgroundPositionY + window.innerHeight/2}px`;
}

function scaleBackground(factor){
	backgroundSize = backgroundSize * factor;
	var backgroundSizeMin = SCENE_CONFIGURATION.getConfiguration().texture_size_min[0];
	var backgroundSizeMax = SCENE_CONFIGURATION.getConfiguration().texture_size_max[0];
	var updatePosition = true;

	if(backgroundSize < backgroundSizeMin){
		backgroundSize = backgroundSizeMin;
		updatePosition = false;
	}

	if(backgroundSize > backgroundSizeMax){
		backgroundSize = backgroundSizeMax;
		updatePosition = false;
	}

	targetDomElement.style.backgroundSize = `${backgroundSize}px`;

	if(updatePosition){
		backgroundPositionY = backgroundPositionY * factor;
		backgroundPositionX = backgroundPositionX * factor;
		targetDomElement.style.backgroundPosition = `${backgroundPositionX + window.innerWidth/2}px ${backgroundPositionY + window.innerHeight/2}px`;
	}
	
}

function updateScene(oldSceneConfiguration,newSceneConfiguration){

	// Set CSS Background
	targetDomElement.style.backgroundImage = `url('${newSceneConfiguration['texture_url'][newSceneConfiguration['texture_index']]}')`;

}

function initializeScene(){

	SCENE_CONFIGURATION.initializeConfiguration({
		"texture_url" : ["./media/placeholder-checker.png"],
		"texture_name": ["Placeholder"],
		"texture_index":0, // If texture_url is multivalued then this value keeps track of the currently selected index
		"texture_size":512,
		"texture_size_min":32,
		"texture_size_max":4096
	});
	SCENE_CONFIGURATION.updateConfiguration({},CONSTANTS.updateMode.startFromDefault);

	targetDomElement = document.querySelector('#renderer_target');
	mouseDown = false;
	backgroundPositionX = 0;
	backgroundPositionY = 0;
	backgroundSize = SCENE_CONFIGURATION.getConfiguration().texture_size[0];

	targetDomElement.addEventListener("mousedown", function(event) {
		mouseDown = true;
		
	});

	targetDomElement.addEventListener("mousemove", function(event) {
		if (mouseDown) {
			moveBackground(event.movementX,event.movementY);
		}
	});

	targetDomElement.addEventListener("mouseup", function() {
		mouseDown = false;
	});

	document.addEventListener("wheel", function(event) {
		event.preventDefault();
		event.stopPropagation();
		var factor = 1 + (event.deltaY * 0.001);
		scaleBackground(factor);
	},{passive:false});

	targetDomElement.addEventListener("touchstart", function(event) {
		mouseDown = true;
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
	});

	scaleBackground(1);
	moveBackground(0,0);
	
}

// MAIN
BASE.start(initializeScene,updateScene,null);