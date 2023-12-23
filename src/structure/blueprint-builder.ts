import { Blueprint } from '../blueprints/blueprint';
import BlueprintContext from './blueprint-context';
import { BlueprintComponent } from '../blueprints/blueprint-component';
import { BlueprintBuilderOptions } from '../models/blueprint-builder-options';
import { ErrorMessages } from '../constants/error-messages';
import { BlueprintRenderable } from '../models/types';

export class BlueprintBuilder {
    private readonly rootComponent: Blueprint | BlueprintComponent;
    private applicationContainer: HTMLElement;
    private blueprintContext: BlueprintContext;

    constructor(rootComponent: Blueprint | BlueprintComponent) {
        this.rootComponent = rootComponent;
        this.applicationContainer = document.body;
        this.blueprintContext = BlueprintContext.createContext();
    }

    container(applicationContainer: HTMLElement) {
        this.applicationContainer = applicationContainer;
        return this;
    }

    context(blueprintContext: BlueprintContext) {
        this.blueprintContext = blueprintContext;
        return this;
    }

    render() {
        if (this.rootComponent instanceof BlueprintComponent) {
            const app = BlueprintBuilder.buildBlueprint(this.rootComponent, {
                parentElem: this.applicationContainer,
                context: this.blueprintContext,
            });
            this.applicationContainer.append(app);
        } else if (this.rootComponent.isFragment) {
            const elements = BlueprintBuilder.buildFragment(
                this.rootComponent,
                {
                    parentElem: this.applicationContainer,
                    context: this.blueprintContext,
                },
            );
            elements.forEach((element) =>
                this.applicationContainer.append(element),
            );
        } else {
            const app = BlueprintBuilder.buildBlueprint(this.rootComponent, {
                parentElem: this.applicationContainer,
                context: this.blueprintContext,
            });
            this.applicationContainer.append(app);
        }
    }

    static build(
        blueprint: BlueprintRenderable,
        context = BlueprintContext.createContext(),
    ): HTMLElement {
        if (blueprint instanceof BlueprintComponent) {
            BlueprintContext.attachContext(context, blueprint.context);
            blueprint = blueprint.compose();
        }
        if (blueprint.isFragment) {
            const container = document.createElement('div');

            BlueprintBuilder.buildFragment(blueprint, {
                parentElem: container,
                context,
            });
            return container;
        }

        return BlueprintBuilder.buildBlueprint(blueprint, {
            parentElem: null,
            context,
        });
    }

    private static buildBlueprint(
        blueprint: Blueprint | BlueprintComponent,
        builderContext: BlueprintBuilderOptions,
    ): HTMLElement {
        if (blueprint instanceof BlueprintComponent) {
            BlueprintContext.attachContext(
                builderContext.context,
                blueprint.context,
            );
            blueprint = blueprint.compose();
        }

        if (blueprint.isFragment) {
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
                    if (child.isFragment) {
                        return BlueprintBuilder.buildFragment(child, {
                            ...builderContext,
                            parentElem: elem,
                        });
                    } else {
                        return BlueprintBuilder.buildBlueprint(child, {
                            ...builderContext,
                            parentElem: elem,
                        });
                    }
                } else if (child instanceof BlueprintComponent) {
                    const context = BlueprintContext.attachContext(
                        builderContext.context,
                        child.context,
                    );

                    const childBlueprint = child.compose();
                    if (childBlueprint.isFragment) {
                        return BlueprintBuilder.buildFragment(childBlueprint, {
                            ...builderContext,
                            parentElem: elem,
                        });
                    } else {
                        return BlueprintBuilder.buildBlueprint(childBlueprint, {
                            ...builderContext,
                            context,
                            parentElem: elem,
                        });
                    }
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

        blueprint.setElement(elem);

        return elem;
    }

    private static buildFragment(
        fragment: Blueprint,
        builderContext: BlueprintBuilderOptions,
    ) {
        if (!fragment.isFragment) {
            throw new Error(
                ErrorMessages.Blueprint.attemptToBuildBlueprintAsFragment,
            );
        }

        fragment.setElement(builderContext.parentElem);

        const elems = (fragment.plans.children as Blueprint[]).flatMap(
            (child) => {
                return BlueprintBuilder.buildBlueprint(child, builderContext);
            },
        );

        builderContext.parentElem.append(...elems);

        return elems;
    }
}
