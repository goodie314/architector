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
    h(number: number) {
        return this.describe(`h${number}`);
    }
    ul() {
        return this.describe('ul');
    }
    li(text?: string) {
        return this.describe('li').text(text);
    }
    label(forName?: string) {
        const label = this.describe('label');
        if (forName) {
            label.attribute('for', forName);
        }
        return label;
    }
    button(text?: string) {
        return this.describe('button').text(text);
    }
    input(type?: string, name?: string) {
        const input = this.describe('input');
        if (type) {
            input.attribute('type', type);
        }
        if (name) {
            input.attribute('name', name);
        }
        return input;
    }
    checkbox() {
        return this.input('checkbox');
    }
}
