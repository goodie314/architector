import BlueprintComponent from '../../../src/blueprints/blueprint-component';
import { Blueprint } from '../../../src/blueprints/blueprint';

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
