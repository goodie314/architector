import { Describer } from './describer';

export default abstract class DescribableComponent {
    private readonly componentName: string;

    protected constructor(componentName: string) {
        this.componentName = componentName;
    }

    abstract compose(): Describer;

    // utility methods to generate components
    describe(tagName: string) {
        return new Describer(tagName);
    }
    div() {
        return this.describe('div');
    }
    span() {
        return this.describe('span');
    }
}
