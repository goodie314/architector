import { DescriberAttributes } from '../models/describer-attributes';
import ElementRef from '../util/element-ref';
import { EventHandler } from '../types/event-handler';

export class Describer {
    private readonly tagName: string;
    private attributes: DescriberAttributes;
    private elementRef: ElementRef;

    constructor(tagName: string) {
        this.tagName = tagName;
        this.attributes = {
            classNames: [],
            attributes: {},
            children: [],
            handlers: {},
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
        components.forEach((component) =>
            this.attributes.children.push(component),
        );
        return this;
    }

    ref(elementRef: ElementRef) {
        this.elementRef = elementRef;
        return this;
    }

    eventHandler(eventName: string, handler: EventHandler) {
        this.attributes.handlers[eventName] = handler;
        return this;
    }

    click(eventHandler: EventHandler) {
        return this.eventHandler('click', eventHandler);
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

        Object.entries(describerAttributes.handlers).forEach(
            ([eventName, eventHandler]) =>
                elem.addEventListener(eventName, (event) => {
                    if (!(event.currentTarget instanceof Element)) {
                        throw new Error(
                            'Internal error. It should not be possible to attach an event listener here where an element is not the target',
                        );
                    }
                    return eventHandler(event.currentTarget, event);
                }),
        );

        if (describer.elementRef) {
            describer.elementRef.set(elem);
        }

        return elem;
    }
}
