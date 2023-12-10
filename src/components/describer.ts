export class Describer {
    private readonly tagName: string;
    private readonly elem: HTMLElement;

    constructor(tagName: string) {
        this.tagName = tagName;

        this.elem = document.createElement(this.tagName);
    }

    id(value: string) {
        this.elem.id = value;
        return this;
    }

    classNames(...values: string[]) {
        this.elem.classList.add(...values);
        return this;
    }

    attribute(attributeMap: { [key: string]: string }) {
        Object.entries(attributeMap).forEach(([key, value]) => {
            this.elem.setAttribute(key, value);
        });

        return this;
    }

    text(text: string) {
        this.elem.textContent = text;
        return this;
    }

    build() {
        return this.elem;
    }
}
