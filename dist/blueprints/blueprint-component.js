"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlueprintComponent = void 0;
const blueprint_1 = require("./blueprint");
const blueprint_context_1 = __importDefault(require("../structure/blueprint-context"));
class BlueprintComponent {
    context;
    constructor(componentName = 'default') {
        if (!this.context) {
            this.context = blueprint_context_1.default.createContext(componentName);
        }
        if (componentName) {
            this.context.attachComponent(this, componentName);
        }
    }
    // utility methods to generate blueprints
    blueprint(tagName) {
        return new blueprint_1.Blueprint(tagName);
    }
    fragment(...blueprints) {
        return blueprint_1.Blueprint.Fragment(...blueprints);
    }
    div() {
        return this.blueprint('div');
    }
    span() {
        return this.blueprint('span');
    }
    h(number) {
        return this.blueprint(`h${number}`);
    }
    ul() {
        return this.blueprint('ul');
    }
    li(text) {
        return this.blueprint('li').text(text);
    }
    form() {
        return this.blueprint('form');
    }
    label(forName) {
        const label = this.blueprint('label');
        if (forName) {
            label.attribute('for', forName);
        }
        return label;
    }
    button(text) {
        return this.blueprint('button').text(text);
    }
    input(type, name) {
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
exports.BlueprintComponent = BlueprintComponent;
