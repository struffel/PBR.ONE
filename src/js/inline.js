function notifyChange(changedConfig,resetValues = false){
    var evt = new CustomEvent('PBR1_CHANGE',{"detail": {"changedConfiguration": changedConfig,"resetValues":resetValues}});
    document.dispatchEvent(evt);
}
