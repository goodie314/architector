import { Describer } from '../components/describer';

export default class DescribablePage {
    private readonly rootComponent: Describer;
    private applicationContainer: Element;

    constructor(rootComponent: Describer) {
        this.rootComponent = rootComponent;
        this.applicationContainer = document.body;
    }

    container(applicationContainer: Element) {
        this.applicationContainer = applicationContainer;
        return this;
    }

    render() {
        const app = Describer.build(this.rootComponent);
        this.applicationContainer.append(app);
    }
}
