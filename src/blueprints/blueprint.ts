import { BlueprintAttributes } from '../models/blueprint-attributes';
import ElementRef from './utils/element-ref';
import { EventHandler } from '../types/event-handler';
import DynamicProp from './utils/dynamic-prop';
import { ErrorMessages } from '../constants/error-messages';
import BlueprintComponent from './blueprint-component';

export class Blueprint {
    private readonly _tagName: string;
    private _isFragment: boolean;
    private readonly _plans: BlueprintAttributes;
    private elementRef: ElementRef;
    private readonly selfRef = new ElementRef();

    private dynamicClassNames: DynamicProp<string>[];

    constructor(tagName: string) {
        this._tagName = tagName;
        this._isFragment = false;
        this._plans = {
            classNames: [],
            attributes: {},
            children: [],
            handlers: {},
        };

        this.dynamicClassNames = [];
    }

    get tagName() {
        return this._tagName;
    }

    get plans() {
        return this._plans;
    }

    get isFragment() {
        return this._isFragment;
    }

    id(value: string | DynamicProp<string>) {
        if (value instanceof DynamicProp) {
            value.onElementChange(
                this.selfRef,
                (element) => (value) => (element.id = value),
            );
        } else {
            this._plans.id = value;
        }
        return this;
    }

    classNames(...values: (string | DynamicProp<string>)[]) {
        values.forEach((value) => {
            if (value instanceof DynamicProp) {
                this.dynamicClassNames.push(value);
            } else {
                this._plans.classNames.push(value);
            }
        });

        this.dynamicClassNames.forEach((prop) => {
            prop.onElementChange(this.selfRef, (el) => (val, prev) => {
                const keepPrev =
                    this._plans.classNames.some(
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

    attribute(name: string, value: string | DynamicProp<string>) {
        if (this._plans.attributes[name]) {
            throw new Error(
                ErrorMessages.Blueprint.duplicateAttributeKey(name),
            );
        }
        if (value instanceof DynamicProp) {
            value.onElementChange(this.selfRef, (el) => (val) => {
                if (val) {
                    el.setAttribute(name, val);
                }
            });
        } else {
            this._plans.attributes[name] = value;
        }
        return this;
    }

    text(text: string | DynamicProp<string>) {
        if (text instanceof DynamicProp) {
            text.onElementChange(
                this.selfRef,
                (el) => (value) => (el.textContent = value),
            );
        } else {
            this._plans.text = text;
        }
        return this;
    }

    append(...components: (Blueprint | BlueprintComponent | string)[]) {
        components.forEach((component) => this._plans.children.push(component));
        return this;
    }

    ref(elementRef: ElementRef) {
        this.elementRef = elementRef;
        return this;
    }

    addEventListener(eventName: string, handler: EventHandler) {
        this._plans.handlers[eventName] = handler;
        return this;
    }

    click(eventHandler: EventHandler) {
        return this.addEventListener('click', eventHandler);
    }

    setElement(element: HTMLElement) {
        this.selfRef?.set(element);
        this.elementRef?.set(element);
    }

    static Fragment(...blueprints: Blueprint[]) {
        const fragment = new Blueprint('fragment');
        blueprints.forEach((blueprint) => fragment.append(blueprint));
        fragment._isFragment = true;
        return fragment;
    }
}
