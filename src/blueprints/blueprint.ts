import { BlueprintAttributes } from '../models/blueprint-attributes';
import ElementRef from './utils/element-ref';
import { EventHandler } from '../types/event-handler';
import BlueprintList from './blueprint-list';
import DynamicProp from './utils/dynamic-prop';

export class Blueprint {
    private readonly tagName: string;
    private plans: BlueprintAttributes;
    private elementRef: ElementRef;
    private readonly selfRef = new ElementRef();

    private dynamicClassNames: DynamicProp<string>[];

    constructor(tagName: string) {
        this.tagName = tagName;
        this.plans = {
            classNames: [],
            attributes: {},
            children: [],
            handlers: {},
        };

        this.dynamicClassNames = [];
    }

    id(value: string | DynamicProp<string>) {
        if (value instanceof DynamicProp) {
            value.onElementChange(
                this.selfRef,
                (element) => (value) => (element.id = value),
            );
        } else {
            this.plans.id = value;
        }
        return this;
    }

    classNames(...values: (string | DynamicProp<string>)[]) {
        values.forEach((value) => {
            if (value instanceof DynamicProp) {
                this.dynamicClassNames.push(value);
            } else {
                this.plans.classNames.push(value);
            }
        });

        this.dynamicClassNames.forEach((prop) => {
            prop.onElementChange(this.selfRef, (el) => (val, prev) => {
                const keepPrev =
                    this.plans.classNames.some(
                        (className) => className === prev,
                    ) ||
                    this.dynamicClassNames.some(
                        (otherProp) => otherProp.currentValue() === prev,
                    );
                if (!keepPrev) {
                    el.classList.remove(prev);
                }
                el.classList.add(val);
            });
        });
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
        components.forEach((component) => this.plans.children.push(component));
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

    static build(blueprint: Blueprint) {
        const elem = document.createElement(blueprint.tagName);
        const plans = blueprint.plans;

        if (plans.id) {
            elem.id = plans.id;
        }
        if (plans.text) {
            elem.textContent = plans.text;
        }

        plans.classNames.forEach((className) => elem.classList.add(className));

        Object.entries(plans.attributes).forEach(([key, value]) =>
            elem.setAttribute(key, value),
        );

        plans.children
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

        Object.entries(plans.handlers).forEach(([eventName, eventHandler]) =>
            elem.addEventListener(eventName, (event) => {
                if (!(event.currentTarget instanceof Element)) {
                    throw new Error(
                        'Internal error. It should not be possible to attach an event listener here where an element is not the target',
                    );
                }
                return eventHandler(event.currentTarget, event);
            }),
        );

        blueprint.selfRef.set(elem);
        if (blueprint.elementRef) {
            blueprint.elementRef.set(elem);
        }

        return elem;
    }
}
