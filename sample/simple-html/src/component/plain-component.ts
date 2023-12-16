import DescribableComponent from '../../../../src/components/describable-component';
import { Describer } from '../../../../src/components/describer';

export default class PlainComponent extends DescribableComponent {
    constructor() {
        super('plain-component');
    }

    compose(): Describer {
        const li = Array(100000)
            .fill(0)
            .map((n, i) => this.describe('li').text(`Item ${i}`));
        return this.describe('div').append(
            this.describe('h1').text('Hello world'),
            this.describe('a')
                .attribute({
                    href: './demo',
                })
                .text('Demo page'),
            this.describe('ul').append(...li),
            this.describe('script').text(
                'window.onload=() => console.log(window.performance)',
            ),
        );
    }
}
