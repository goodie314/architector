import { Blueprint } from '../blueprints/blueprint';
import BlueprintBuildContext from './blueprint-build-context';

export default class BlueprintBuilder {
    private readonly rootComponent: Blueprint;
    private applicationContainer: HTMLElement;
    private blueprintContext: BlueprintBuildContext;

    constructor(rootComponent: Blueprint) {
        this.rootComponent = rootComponent;
        this.applicationContainer = document.body;
        this.blueprintContext = new BlueprintBuildContext();
    }

    container(applicationContainer: HTMLElement) {
        this.applicationContainer = applicationContainer;
        return this;
    }

    context(blueprintContext: BlueprintBuildContext) {
        this.blueprintContext = blueprintContext;
        return this;
    }

    render() {
        if (this.rootComponent.isFragment()) {
            const elements = Blueprint.buildFragment(this.rootComponent, {
                parentElem: this.applicationContainer,
                context: this.blueprintContext,
            });
            elements.forEach((element) =>
                this.applicationContainer.append(element),
            );
        } else {
            const app = Blueprint.build(this.rootComponent, {
                parentElem: this.applicationContainer,
                context: this.blueprintContext,
            });
            this.applicationContainer.append(app);
        }
    }

    static build(blueprint: Blueprint, context = new BlueprintBuildContext()) {
        if (blueprint.isFragment()) {
            const container = document.createElement('div');
            Blueprint.buildFragment(blueprint, {
                parentElem: container,
                context,
            });
            return container;
        }

        return Blueprint.build(blueprint, { parentElem: null, context });
    }
}
