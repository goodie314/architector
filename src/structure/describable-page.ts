import DescribableComponent from '../components/describable-component';
import { Describer } from '../components/describer';

export default class DescribablePage {
    private readonly rootComponent: DescribableComponent;
    private applicationContainer: Element;

    constructor(rootComponent: DescribableComponent) {
        this.rootComponent = rootComponent;
        this.applicationContainer = document.body;
    }

    container(applicationContainer: Element) {
        this.applicationContainer = applicationContainer;
        return this;
    }

    render() {
        const app = Describer.build(this.rootComponent.compose());
        this.applicationContainer.append(app);
    }
}
