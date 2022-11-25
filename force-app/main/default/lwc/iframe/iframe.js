import { LightningElement } from "lwc";

export default class Iframe extends LightningElement {
	get iframeElement() {
		return this.template.querySelector("iframe");
	}

	sendData() {
		const { contentWindow, contentDocument } = this.iframeElement;
		console.log("Content Document: ", contentDocument);
		console.log("Content Window: ", contentWindow);
		contentWindow.postMessage("Message from lwc", "*");
	}
}
