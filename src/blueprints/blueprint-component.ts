import { Blueprint } from './blueprint';
import BlueprintContext from '../structure/blueprint-context';

export abstract class BlueprintComponent {
    public context: BlueprintContext;

    constructor(componentName = 'default') {
        if (!this.context) {
            this.context = BlueprintContext.createContext(componentName);
        }
        if (componentName) {
            this.context.attachComponent(this, componentName);
        }
    }

    abstract compose(): Blueprint;

    // utility methods to generate blueprints
    protected blueprint(tagName: string) {
        return new Blueprint(tagName);
    }

    protected fragment(...blueprints: Blueprint[]) {
        return Blueprint.Fragment(...blueprints);
    }

    protected div() {
        return this.blueprint('div');
    }
    protected span() {
        return this.blueprint('span');
    }
    protected h(number: number) {
        return this.blueprint(`h${number}`);
    }
    protected ul() {
        return this.blueprint('ul');
    }
    protected li(text?: string) {
        return this.blueprint('li').text(text);
    }
    protected form() {
        return this.blueprint('form');
    }
    protected label(forName?: string) {
        const label = this.blueprint('label');
        if (forName) {
            label.attribute('for', forName);
        }
        return label;
    }
    protected button(text?: string) {
        return this.blueprint('button').text(text);
    }
    protected input(type?: string, name?: string) {
        const input = this.blueprint('input');
        if (type) {
            input.attribute('type', type);
        }
        if (name) {
            input.attribute('name', name);
        }
        return input;
    }
    protected checkbox() {
        return this.input('checkbox');
    }
}
