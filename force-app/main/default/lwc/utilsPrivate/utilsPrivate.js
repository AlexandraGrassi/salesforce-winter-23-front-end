export { keyCodes, codes, runActionOnBufferedTypedCharacters, normalizeKeyValue, isShiftMetaOrControlKey } from "./keyboard";

export function getRealDOMId(el) {
	if (el && typeof el === "string") {
		return el;
	} else if (el) {
		return el.getAttribute("id");
	}
	return null;
}

const URL_CHECK_REGEX = /^(\/+|\.+|ftp|http(s?):\/\/)/i;

export function isAbsoluteUrl(url) {
	return URL_CHECK_REGEX.test(url);
}

export function getShadowActiveElement() {
	let activeElement = document.activeElement;
	while (activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
		activeElement = activeElement.shadowRoot.activeElement;
	}
	return activeElement;
}

export function getShadowActiveElements() {
	let activeElement = document.activeElement;
	const shadowActiveElements = [];
	while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
		shadowActiveElements.push(activeElement);
		activeElement = activeElement.shadowRoot.activeElement;
	}
	if (activeElement) {
		shadowActiveElements.push(activeElement);
	}
	return shadowActiveElements;
}

export function isRTL() {
	return document.dir === "rtl";
}

export function isUndefinedOrNull(value) {
	return value === null || value === undefined;
}

export function isNotUndefinedOrNull(value) {
	return !isUndefinedOrNull(value);
}

const DEFAULT_ZINDEX_BASELINE = 9000;

export function getZIndexBaseline() {
	const value = (window.getComputedStyle(document.documentElement) || document.documentElement.style).getPropertyValue("--lwc-zIndexModal");

	const base = parseInt(value, 10);

	return isNaN(base) ? DEFAULT_ZINDEX_BASELINE : base;
}

export function timeout(interval) {
	return new Promise((resolve) => {
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		setTimeout(resolve, interval);
	});
}

export function animationFrame() {
	return new Promise((resolve) => {
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		window.requestAnimationFrame(resolve);
	});
}

export function escapeHTML(html) {
	return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
