import { api, LightningElement } from "lwc";
import { codes, keyCodes } from "c/utilsPrivate";
import { labels } from "./labels";

const LIGHTNING_INPUT_FIELD = "LIGHTNING-INPUT-FIELD";
const EVENT_PARAMS = {
	composed: true,
	bubbles: true,
	cancelable: true
};

// If you have any questions or improvement ideas tag @Alexandra Grassi in slack

// (property - string?) modal-header : use to display a title for your modal
// (property - string?) modal-tagline : use to display a subtitle for your modal
// (property - string?) modal-classes : use to add aditional classes to .slds-modal. For example, you can use .slds-modal_medium to increase modal size
// (property - string?) footer-classes : use to add aditional classes to .slds-modal__footer. For example, you can use .slds-modal__footer_directional

// (property - boolean?) hide-save-button : use to hide Save button in the footer, default - visible
// (property - string?) save-label : use to rename Save button

// (property - boolean?) hide-cancel-button : use to hide Cancel button in the footer, , default - visible
// (property - string?) cancel-label : use to rename Cancel button

// (slot - name = "modalHeader") this slot is used to inject markup into the custom header of the modal
// (slot - name = "modalContent") this slot is used to inject markup into the body of the modal
// (slot - name = "footerActions") this slot is used to inject custom actions to modal footer

// (custom event) save - dispatches on Save button click
// (custom event) close - dispatches when modal is closed

export default class ModalGeneric extends LightningElement {
	@api
	modalHeader = "";
	@api
	modalTagline = "";
	@api modalClasses = "";
	@api footerClasses = "";

	@api
	hideSaveButton = false;
	@api
	saveLabel = labels.save;

	@api
	hideCancelButton = false;
	@api
	cancelLabel = labels.cancel;

	isFirstRender = true;
	isOpen = false;

	connectedCallback() {
		this.toggleModal();
	}

	renderedCallback() {
		if (this.isFirstRender) {
			this.isFirstRender = false;
			this.focusFirstChild();
		}
	}

	get labels() {
		return labels;
	}

	get cssClass() {
		const baseClasses = ["slds-modal"];
		baseClasses.push([this.isOpen ? `slds-visible slds-fade-in-open ${this.modalClasses}` : "slds-hidden"]);
		return baseClasses.join(" ");
	}

	get footerClass() {
		const baseClasses = ["slds-modal__footer"];
		baseClasses.push(this.footerClasses);
		return baseClasses.join(" ");
	}

	get modalAriaHidden() {
		return !this.isOpen;
	}

	get closeButton() {
		// close button is 'X' button on the right top corner of modal
		return this.template.querySelector('button[title="Close"]');
	}

	get saveButton() {
		return this.template.querySelector("button.save");
	}

	toggleModal() {
		this.isOpen = !this.isOpen;
	}

	closeModal() {
		this.toggleModal();
		this.dispatchEvent(
			new CustomEvent("close", {
				...EVENT_PARAMS
			})
		);
	}

	saveHandler() {
		this.dispatchEvent(
			new CustomEvent("save", {
				...EVENT_PARAMS
			})
		);
	}

	innerClickHandler(event) {
		// to prevent trigger of outsideClickListener
		event.stopPropagation();
	}

	keyHandler(event) {
		if (event.keyCode === keyCodes.escape || event.code === codes.escape) {
			this.closeModal();
		} else if (event.keyCode === keyCodes.tab || event.code === codes.tab) {
			const el = this.template.activeElement;
			let focusableElement;
			// to trap focus and prevent focus go outside modal
			// here focus is moved to first focusable elements in the header or footer
			if (event.shiftKey && el && el.classList.contains("firstlink")) {
				// if focus is on a firstlink and you move focus back
				// focus moved to save button in the footer

				// the save button is only shown
				// for modals with a hide-save-button = false
				// fallback to the close button, otherwise
				focusableElement = !this.hideSaveButton ? this.saveButton : this.closeButton;
			} else if (el && el.classList.contains("lastLink")) {
				// if focus is on a lastLink
				// focus moved to close button (on the top of modal)
				focusableElement = this.closeButton;
			}
			if (focusableElement) {
				focusableElement.focus();
			}
		}
	}

	async focusFirstChild() {
		const children = [...this.querySelectorAll("*")];
		for (let child of children) {
			let hasBeenFocused = false;
			await this.setFocus(child).then((res) => {
				hasBeenFocused = res;
			});
			if (hasBeenFocused) {
				return;
			}
		}
		// if there is no focusable markup from slots
		// focus the first button
		if (this.closeButton) {
			this.closeButton.focus();
		}
	}

	setFocus(el) {
		return new Promise((resolve) => {
			/**
			 * don't ever try to trap focus on a disabled element that can't be interacted with ...
			 * As well, there's been some regression with lightning-input-field components -
			 * they don't properly pass the "focus" event downwards through the component hierarchy, which has the fun effect of:
			 * - not triggering the promise to resolve (not what we wanted)
			 * - triggering the validation for required fields (DEFINITELY not what we wanted)
			 */
			if (el.disabled || (el.tagName === LIGHTNING_INPUT_FIELD && el.required)) {
				return resolve(false);
			} else {
				const promiseListener = () => resolve(true);
				try {
					el.addEventListener("focus", promiseListener);
					el.focus && el.focus();
					el.removeEventListener("focus", promiseListener);

					setTimeout(() => resolve(false), 0);
				} catch (ex) {
					return resolve(false);
				}
			}
		});
	}
}

// TODO add focus back to element which opened modal (not possible yet)
// TODO add enter listener to dispatch save event
