// variables 'base' anc 'configurations' should already be set at this point!

var main = document.querySelector("main");
var i = 0;
for (const [key, value] of Object.entries(configurations)) {
	main.innerHTML += `
	<div>
		<h2>${key}</h2>
		<input type="text" value='${base}${value}' oninput="document.getElementById(\'iframe-${i}\').src=this.value;">
		<iframe id="iframe-${i}" src='${base}${value}'></iframe>
	</div>
	`;
	i++;
}