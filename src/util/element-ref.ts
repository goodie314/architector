export default class ElementRef<T extends HTMLElement = HTMLElement> {
    private readonly element: Promise<T>;
    private onLoaded: (element: T) => void;

    constructor() {
        this.element = new Promise<T>((resolve) => (this.onLoaded = resolve));
    }

    get() {
        return this.element;
    }

    set(element: T) {
        this.onLoaded(element);
    }
}
