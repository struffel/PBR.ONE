
const messagesDomElement = document.querySelector('#messageArea');

export class Message{
	constructor(message,color = "var(--info)"){

		// Import variables
		this.message = message;
		this.color = color;

		// Defines whether the message can be edited using the update-methods.
		// This can be used to stop event listeners from overwriting the content of a message.
		this.editable = true;

		// Create DOM element
		this.domElement = document.createElement('div');
		this.domElement.style.color = color;
		this.domElement.innerHTML = message;
	}

	updateColor(color){
		if(this.editable){
			this.color = color;
			this.domElement.style.color = this.color;
		}
		return this;
	}

	updateMessage(message){
		if(this.editable){
			this.message = message;
			this.domElement.innerHTML = this.message;
		}
		return this;
	}

	show(){
		messagesDomElement.appendChild(this.domElement);
		return this;
	}

	remove(timeout){

		// Editing is no longer possible once removal has been scheduled.
		this.editable = false;

		setTimeout(() => {
			messagesDomElement.removeChild(this.domElement);
		}, timeout);
	}
}

export function newError(message,error){
	if(error){
		new Message(`${message}: ${error}`,"var(--error)").show().remove(10000);
	}else{
		new Message(message,"var(--error)").show().remove(10000);
	}
}

export function newWarning(message){
	new Message(message,"var(--warning)").show().remove(10000);
}

export function removeMessagesImmediately(messages){
	messages.forEach(m => {
		m.remove(0);
	});
}

export function showMessages(messages){
	messages.forEach(m => {
		m.show();
	});
}