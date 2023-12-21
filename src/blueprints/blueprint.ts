import { BlueprintAttributes } from '../models/blueprint-attributes';
import ElementRef from './utils/element-ref';
import { EventHandler } from '../types/event-handler';
import DynamicProp from './utils/dynamic-prop';
import { ErrorMessages } from '../constants/error-messages';
import { BlueprintBuilderOptions } from '../models/blueprint-builder-options';
import BlueprintComponent from './blueprint-component';

export class Blueprint {
    private readonly tagName: string;
    private _isFragment: boolean;
    private plans: BlueprintAttributes;
    private elementRef: ElementRef;
    private readonly selfRef = new ElementRef();

    private dynamicClassNames: DynamicProp<string>[];

    constructor(tagName: string) {
        this.tagName = tagName;
        this._isFragment = false;
        this.plans = {
            classNames: [],
            attributes: {},
            children: [],
            handlers: {},
        };

        this.dynamicClassNames = [];
    }

    isFragment() {
        return this._isFragment;
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

    attribute(name: string, value: string | DynamicProp<string>) {
        if (this.plans.attributes[name]) {
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
            this.plans.attributes[name] = value;
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
            this.plans.text = text;
        }
        return this;
    }

    append(...components: (Blueprint | BlueprintComponent | string)[]) {
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

    static Fragment(...blueprints: Blueprint[]) {
        const fragment = new Blueprint('fragment');
        blueprints.forEach((blueprint) => fragment.append(blueprint));
        fragment._isFragment = true;
        return fragment;
    }

    static build(
        blueprint: Blueprint | BlueprintComponent,
        builderContext: BlueprintBuilderOptions,
    ): HTMLElement {
        if (blueprint instanceof BlueprintComponent) {
            blueprint.attachContext(builderContext.context);
            blueprint = blueprint.compose();
        }

        if (blueprint.isFragment()) {
            throw new Error(
                ErrorMessages.Blueprint.attemptToBuildFragmentAsBlueprint,
            );
        }
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
                    if (child.isFragment()) {
                        return Blueprint.buildFragment(child, {
                            ...builderContext,
                            parentElem: elem,
                        });
                    } else {
                        return Blueprint.build(child, {
                            ...builderContext,
                            parentElem: elem,
                        });
                    }
                } else if (child instanceof BlueprintComponent) {
                    const context = child.attachContext(builderContext.context);
                    return Blueprint.build(child.compose(), {
                        ...builderContext,
                        context,
                        parentElem: elem,
                    });
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

    static buildFragment(
        fragment: Blueprint,
        builderContext: BlueprintBuilderOptions,
    ) {
        if (!fragment.isFragment()) {
            throw new Error(
                ErrorMessages.Blueprint.attemptToBuildBlueprintAsFragment,
            );
        }

        if (fragment.elementRef) {
            fragment.elementRef.set(builderContext.parentElem);
        }

        return (fragment.plans.children as Blueprint[]).flatMap((child) => {
            return Blueprint.build(child, builderContext);
        });
    }
}
