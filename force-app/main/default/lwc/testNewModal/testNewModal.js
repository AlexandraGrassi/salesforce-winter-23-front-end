import { LightningElement } from "lwc";
import Modal from "c/modal";

export default class TestNewModal extends LightningElement {
	selectedProduct;

	async handleOpen() {
		// if modal closed with X button, promise returns result = 'undefined'
		// if modal closed with OK button, promise returns result = 'okay'
		this.selectedProduct = await Modal.open({
			size: "large",
			description: "Accessible description of modal's purpose",
			products: ["flower", "chocolate", "wine"],
			selectedProduct: this.selectedProduct,
			// event triggered when new CustomEvent('select', {detail: {}});
			// occurs *from within* LightningModal.
			onselect: (e) => {
				// stop further propagation of the event
				e.stopPropagation();
				console.log("Product selected: ", e?.detail?.value);
			}
		});
	}
}
