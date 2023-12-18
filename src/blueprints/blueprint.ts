import { BlueprintAttributes } from '../models/blueprint-attributes';
import ElementRef from './utils/element-ref';
import { EventHandler } from '../types/event-handler';
import BlueprintList from './blueprint-list';
import DynamicProp from './utils/dynamic-prop';

export class Blueprint {
    private readonly tagName: string;
    private plans: BlueprintAttributes;
    private elementRef: ElementRef<HTMLElement>;

    constructor(tagName: string) {
        this.tagName = tagName;
        this.plans = {
            classNames: [],
            attributes: {},
            children: [],
            handlers: {},
        };
    }

    id(value: string | DynamicProp<string>) {
        if (value instanceof DynamicProp) {
            value.onChange((val) => {
                this.plans.id = val
            });
        } else {
            this.plans.id = value;
        }
        return this;
    }

    classNames(...values: string[]) {
        this.plans.classNames.push(...values);
        return this;
    }

    attribute(name: string, value: string) {
        this.plans.attributes[name] = value;
        return this;
    }

    text(text: string) {
        this.plans.text = text;
        return this;
    }

    append(...components: (Blueprint | string | BlueprintList)[]) {
        components.forEach((component) =>
            this.plans.children.push(component),
        );
        return this;
    }

    ref(elementRef: ElementRef) {
        this.elementRef = elementRef;
        return this;
    }

    addEventListener(eventName: string, handler: EventHandler) {
        this.plans.handlers[eventName] = handler;
        return this;
    }

    click(eventHandler: EventHandler) {
        return this.addEventListener('click', eventHandler);
    }

    static build(describer: Blueprint) {
        const elem = document.createElement(describer.tagName);
        const describerAttributes = describer.plans;

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

        describerAttributes.children
            .flatMap<string | HTMLElement>((child) => {
                if (child instanceof Blueprint) {
                    return [Blueprint.build(child)];
                } else if (child instanceof BlueprintList) {
                    return BlueprintList.Build(child, elem);
                } else {
                    return [child as string];
                }
            })
            .forEach((child) => elem.append(child));

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
