import { Blueprint } from '../blueprints/blueprint';

export default class BlueprintBuilder {
    private readonly rootComponent: Blueprint;
    private applicationContainer: HTMLElement;

    constructor(rootComponent: Blueprint) {
        this.rootComponent = rootComponent;
        this.applicationContainer = document.body;
    }

    container(applicationContainer: HTMLElement) {
        this.applicationContainer = applicationContainer;
        return this;
    }

    render() {
        if (this.rootComponent.isFragment()) {
            const elements = Blueprint.buildFragment(this.rootComponent, {
                parentElem: this.applicationContainer,
            });
            elements.forEach((element) =>
                this.applicationContainer.append(element),
            );
        } else {
            const app = Blueprint.build(this.rootComponent, {
                parentElem: this.applicationContainer,
            });
            this.applicationContainer.append(app);
        }
    }
}
