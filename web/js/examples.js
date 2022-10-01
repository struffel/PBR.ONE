function handleTextAreaChange(event) {

    var exampleId = event['target']['attributes']['data-example-id']['value'];
    var targetIframe = document.querySelector(`iframe[data-example-id=${exampleId}]`);
    var targetNewSrc = targetIframe.attributes['data-base-src']['value'] + event['target']['value'];

    targetNewSrc = targetNewSrc.replace(/\s| /g,"");
    targetIframe.src = targetNewSrc;
}

document.querySelectorAll("textarea").forEach(textArea => {
    textArea.addEventListener("input", handleTextAreaChange);
    textArea.dispatchEvent(new Event("input"));
});