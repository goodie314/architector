import BlueprintComponent from '../../../../src/components/blueprint-component';
import { Blueprint } from '../../../../src/components/blueprint';

export default class PlainComponent extends BlueprintComponent {
    constructor() {
        super('plain-component');
    }

    compose(): Blueprint {
        const li = Array(100000)
            .fill(0)
            .map((n, i) => this.blueprint('li').text(`Item ${i}`));
        return this.blueprint('div').append(
            this.blueprint('h1').text('Hello world'),
            this.blueprint('a').attribute('href', './demo').text('Demo page'),
            this.blueprint('ul').append(...li),
            this.blueprint('script').text(
                'window.onload=() => console.log(window.performance)',
            ),
        );
    }
}
