
var loadingNotesDomElement = document.querySelector('#loadingNotes');

export class LoadingNote{
	constructor(displayName,url,tryResolvingSize = true){
		console.debug("Creating a new loading indicator",displayName,url,tryResolvingSize);
		this.displayName = displayName;
		this.url = url;
		this.tryResolvingSize = tryResolvingSize;

		this.domElement = document.createElement('div');
		this.domElement.innerHTML = `Loading <strong>${this.displayName}</strong>`;

		this.state = "initialized";
	}

	start() {
		console.debug("Beginning to show loading indicator ",this.displayName);

		if(this.tryResolvingSize){
			console.debug("Will attempt to fetch the content-length for URL",this.url);
			fetch(this.url, {method: 'HEAD'}).then((result) => {
				var bytes = result.headers.get("content-length");
				console.debug("Successfully fetched content length in bytes for URL",this.url,bytes);
				if(this.state == "active"){
					this.domElement.innerHTML += ` [${formatBytes(bytes)}]`;
				}
			});
		}
		this.state = "active";
		loadingNotesDomElement.appendChild(this.domElement);
	}

	finish(){
		console.debug("Removing loading indicator (success)",this.displayName);
		this.domElement.innerHTML = `<em style="color:lightgreen;">Loading <strong>${this.displayName}</strong> COMPLETE</em>`;
		this.state = "done";
		
		setTimeout(() => {
			loadingNotesDomElement.removeChild(this.domElement);
		}, "500");
	}

	fail(){
		console.debug("Removing loading indicator (failure)",this.displayName);
		this.state = "failed";
		this.domElement.innerHTML = `<em style="color:red;">Loading <strong>${this.displayName}</strong> FAILED</em>`;
		
		setTimeout(() => {
			loadingNotesDomElement.removeChild(this.domElement);
		}, "5000");

		
	}
}

// https://stackoverflow.com/a/39906526
const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
function formatBytes(x){
	let l = 0, n = parseInt(x, 10) || 0;
	
	while(n >= 1024 && ++l){
		n = n/1024;
	}
	return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}