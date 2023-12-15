import DescribableComponent from '../../../../src/components/describable-component';
import { Describer } from '../../../../src/components/describer';

export default class PlainComponent extends DescribableComponent {
    constructor() {
        super('plain-component');
    }

    compose(): Describer {
        return this.describe('h1').text('Hello world');
    }
}
