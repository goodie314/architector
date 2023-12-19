import { Blueprint } from './blueprint';

export default abstract class BlueprintComponent {
    abstract compose(): Blueprint;

    // utility methods to generate blueprints
    blueprint(tagName: string) {
        return new Blueprint(tagName);
    }

    fragment(...blueprints: Blueprint[]) {
        return Blueprint.Fragment(...blueprints);
    }

    div() {
        return this.blueprint('div');
    }
    span() {
        return this.blueprint('span');
    }
    h(number: number) {
        return this.blueprint(`h${number}`);
    }
    ul() {
        return this.blueprint('ul');
    }
    li(text?: string) {
        return this.blueprint('li').text(text);
    }
    label(forName?: string) {
        const label = this.blueprint('label');
        if (forName) {
            label.attribute('for', forName);
        }
        return label;
    }
    button(text?: string) {
        return this.blueprint('button').text(text);
    }
    input(type?: string, name?: string) {
        const input = this.blueprint('input');
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
