
var loadingNotesDomElement = document.querySelector('#loadingNotes');

export class LoadingNote{
	constructor(displayName,url,tryResolvingSize = true){
		this.displayName = displayName;
		this.url = url;
		this.tryResolvingSize = tryResolvingSize;

		this.domElement = document.createElement('div');
		this.domElement.innerHTML = `Loading <strong>${this.displayName}</strong>`;

		if(tryResolvingSize){
			fetch(url, {method: 'HEAD'}).then((result) => {
				var bytes = result.headers.get("content-length");
				this.domElement.innerHTML += ` [${formatBytes(bytes)}]`;
			});
		}
	}

	start() {
		loadingNotesDomElement.appendChild(this.domElement);
	}

	finish(){
		loadingNotesDomElement.removeChild(this.domElement);
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