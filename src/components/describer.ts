import { DescriberAttributes } from '../models/describer-attributes';

export class Describer {
    private readonly tagName: string;
    private attributes: DescriberAttributes;

    constructor(tagName: string) {
        this.tagName = tagName;
        this.attributes = {
            classNames: [],
            attributes: {},
            children: [],
        };
    }

    id(value: string) {
        this.attributes.id = value;
        return this;
    }

    classNames(...values: string[]) {
        this.attributes.classNames.push(...values);
        return this;
    }

    attribute(attributeMap: { [key: string]: string }) {
        Object.entries(attributeMap).forEach(([key, value]) => {
            this.attributes.attributes[key] = value;
        });

        return this;
    }

    text(text: string) {
        this.attributes.text = text;
        return this;
    }

    append(...components: Describer[]) {
        this.attributes.children.push(...components);
        return this;
    }

    static build(describer: Describer) {
        const elem = document.createElement(describer.tagName);
        const describerAttributes = describer.attributes;

        if (describerAttributes.id) {
            elem.id = describerAttributes.id;
        }
        if (describerAttributes.text) {
            elem.textContent = describerAttributes.text;
        }

        describerAttributes.classNames.forEach((className) =>
            elem.classList.add(className),
        );
        Object.entries(describerAttributes.attributes).forEach(([key, value]) =>
            elem.setAttribute(key, value),
        );
        describerAttributes.children.forEach((child) =>
            elem.appendChild(Describer.build(child)),
        );

        return elem;
    }
}
