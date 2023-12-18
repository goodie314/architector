import { Blueprint } from '../components/blueprint';

export default class BlueprintBuilder {
    private readonly rootComponent: Blueprint;
    private applicationContainer: Element;

    constructor(rootComponent: Blueprint) {
        this.rootComponent = rootComponent;
        this.applicationContainer = document.body;
    }

    container(applicationContainer: Element) {
        this.applicationContainer = applicationContainer;
        return this;
    }

    render() {
        const app = Blueprint.build(this.rootComponent);
        this.applicationContainer.append(app);
    }
}
