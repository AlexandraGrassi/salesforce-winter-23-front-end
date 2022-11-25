import { api } from "lwc";
import LightningModal from "lightning/modal";

export default class Modal extends LightningModal {
	@api products = [];
	@api
	get selectedProduct() {
		return this._selectedProduct;
	}
	set selectedProduct(value) {
		this._selectedProduct = value;
	}
	_selectedProduct = "";

	get options() {
		return this.products.map((product) => {
			return {
				label: product,
				value: product
			};
		});
	}

	handleChange(event) {
		this._selectedProduct = event.detail.value;
		this.dispatchEvent(
			new CustomEvent("select", {
				detail: {
					value: this._selectedProduct
				}
			})
		);
	}

	handleSelect() {
		this.close(this.selectedProduct);
	}
}
