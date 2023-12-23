"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blueprint = void 0;
const element_ref_1 = __importDefault(require("./utils/element-ref"));
const dynamic_prop_1 = __importDefault(require("./utils/dynamic-prop"));
const error_messages_1 = require("../constants/error-messages");
class Blueprint {
    _tagName;
    _isFragment;
    _plans;
    elementRef;
    selfRef = new element_ref_1.default();
    dynamicClassNames;
    constructor(tagName) {
        this._tagName = tagName;
        this._isFragment = false;
        this._plans = {
            classNames: [],
            attributes: {},
            children: [],
            handlers: {},
        };
        this.dynamicClassNames = [];
    }
    get tagName() {
        return this._tagName;
    }
    get plans() {
        return this._plans;
    }
    get isFragment() {
        return this._isFragment;
    }
    id(value) {
        if (value instanceof dynamic_prop_1.default) {
            value.onElementChange(this.selfRef, (element) => (value) => (element.id = value));
        }
        else {
            this._plans.id = value;
        }
        return this;
    }
    classNames(...values) {
        values.forEach((value) => {
            if (value instanceof dynamic_prop_1.default) {
                this.dynamicClassNames.push(value);
            }
            else {
                this._plans.classNames.push(value);
            }
        });
        this.dynamicClassNames.forEach((prop) => {
            prop.onElementChange(this.selfRef, (el) => (val, prev) => {
                const keepPrev = this._plans.classNames.some((className) => className === prev) ||
                    this.dynamicClassNames.some((otherProp) => otherProp.currentValue() === prev);
                if (!keepPrev) {
                    el.classList.remove(prev);
                }
                el.classList.add(val);
            });
        });
        return this;
    }
    attribute(name, value) {
        if (this._plans.attributes[name]) {
            throw new Error(error_messages_1.ErrorMessages.Blueprint.duplicateAttributeKey(name));
        }
        if (value instanceof dynamic_prop_1.default) {
            value.onElementChange(this.selfRef, (el) => (val) => {
                if (val) {
                    el.setAttribute(name, val);
                }
            });
        }
        else {
            this._plans.attributes[name] = value;
        }
        return this;
    }
    text(text) {
        if (text instanceof dynamic_prop_1.default) {
            text.onElementChange(this.selfRef, (el) => (value) => (el.textContent = value));
        }
        else {
            this._plans.text = text;
        }
        return this;
    }
    append(...components) {
        components.forEach((component) => this._plans.children.push(component));
        return this;
    }
    ref(elementRef) {
        this.elementRef = elementRef;
        return this;
    }
    addEventListener(eventName, handler) {
        this._plans.handlers[eventName] = handler;
        return this;
    }
    click(eventHandler) {
        return this.addEventListener('click', eventHandler);
    }
    setElement(element) {
        this.selfRef?.set(element);
        this.elementRef?.set(element);
    }
    static Fragment(...blueprints) {
        const fragment = new Blueprint('fragment');
        blueprints.forEach((blueprint) => fragment.append(blueprint));
        fragment._isFragment = true;
        return fragment;
    }
}
exports.Blueprint = Blueprint;
