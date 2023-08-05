
import * as MESSAGE from "./message.js";

export class LoadingNote{
	constructor(displayName,url,tryResolvingSize = true){
		console.debug("Creating a new loading indicator (displayName,url,tryResolvingSize): ",displayName,url,tryResolvingSize);
		this.displayName = displayName;
		this.url = url;
		this.tryResolvingSize = tryResolvingSize;

		this.loadingMessage = new MESSAGE.Message(`Loading <strong>${this.displayName}</strong>`);
	}

	start() {
		if(this.tryResolvingSize){
			console.debug("Attempting to fetch content-length (url): ",this.url);
			fetch(this.url, {method: 'HEAD'}).then((result) => {
				var bytes = result.headers.get("content-length");
				console.debug("Successfully fetched content length in bytes (url,bytes)",this.url,bytes);
				this.loadingMessage.updateMessage(`Loading <strong>${this.displayName}</strong> [${formatBytes(bytes)}]`);
			});
		}

		this.loadingMessage.show();
	}

	finish(){
		this.loadingMessage.updateMessage(`Loading <strong>${this.displayName}</strong> [COMPLETE]`);
		this.loadingMessage.updateColor("var(--success)");
		this.loadingMessage.remove(1000);
	}

	fail(error){
		this.loadingMessage.updateMessage(`Loading <strong>${this.displayName}</strong> [FAILED]`);
		this.loadingMessage.updateColor("var(--error)");
		this.loadingMessage.remove(5000);
		if(error){
			new MESSAGE.newError(`Error while loading ${this.url}`,error);
		}
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