import BlueprintComponent from '../../../src/components/blueprint-component';
import { Blueprint } from '../../../src/components/blueprint';

export default class SimpleHtmlComponent extends BlueprintComponent {
    constructor() {
        super('simple-html');
    }
    compose(): Blueprint {
        return this.div()
            .id('test-id')
            .classNames('class-1', 'class-2')
            .attribute('test', 'test-attribute')
            .text('Hello');
    }
}
