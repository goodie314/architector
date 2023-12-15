import DescribableComponent from '../../../src/components/describable-component';
import { Describer } from '../../../src/components/describer';

export default class SimpleHtmlComponent extends DescribableComponent {
    constructor() {
        super('simple-html');
    }
    compose(): Describer {
        return this.div()
            .id('test-id')
            .classNames('class-1', 'class-2')
            .attribute({
                test: 'test-attribute',
            })
            .text('Hello');
    }
}
