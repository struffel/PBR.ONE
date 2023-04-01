/**
 * A small function assigned to the global window object that makes it possible to trigger scene configuration updates using inline JS.
 * It is added to the window object to make it accessible everywhere, even outside module code.
 * @param {*} changedConfig 
 * @param {*} resetValues 
 */
window.PBR1_CHANGE = function(changedConfig,resetValues = false){
    var evt = new CustomEvent('PBR1_CHANGE',{"detail": {"changedConfiguration": changedConfig,"resetValues":resetValues}});
    document.dispatchEvent(evt);
}

/**
 * Function for toggling the GUI.
 */
window.PBR1_GUI_TOGGLE = function(){
    
}