
const messagesDomElement = document.querySelector('#loadingNotes');

export class Message{
	constructor(message,color){

		// Import variables
		this.message = message;
		this.color = color;

		// Defines whether the message can be edited using the update-methods.
		// This can be used to stop event listeners from overwriting the content of a message.
		this.editable = true;

		// Create DOM element
		this.domElement = document.createElement('div');
		this.domElement.style.color = "var(--info)";
		this.domElement.innerHTML = message;
	}

	updateColor(color){
		if(this.editable){
			this.color = color;
			this.domElement.style.color = this.color;
		}
	}

	updateMessage(message){
		if(this.editable){
			this.message = message;
			this.domElement.innerHTML = this.message;
		}
	}

	show(){
		messagesDomElement.appendChild(this.domElement);
	}

	remove(timeout){

		// Editing is no longer possible once removal has been scheduled.
		this.editable = false;

		setTimeout(() => {
			messagesDomElement.removeChild(this.domElement);
		}, timeout);
	}
}