export default class ElementRef {
    private element: Promise<Element>;
    private onLoaded: (element: Element) => void;

    constructor() {
        this.element = new Promise<Element>(
            (resolve) => (this.onLoaded = resolve),
        );
    }

    get() {
        return this.element;
    }

    set(element: Element) {
        this.onLoaded(element);
    }
}
