import { LightningElement } from "lwc";

export default class TestOldModal extends LightningElement {
	products = ["flower", "chocolate", "wine"];
	selectedProduct;
	showModal = false;

	get options() {
		return this.products.map((product) => {
			return {
				label: product,
				value: product
			};
		});
	}

	handleOpen() {
		this.showModal = true;
	}

	handleClose() {
		this.showModal = false;
	}

	handleChange(event) {
		this.selectedProduct = event.detail.value;
	}
}
