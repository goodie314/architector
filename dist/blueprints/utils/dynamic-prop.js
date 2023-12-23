"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const value_util_1 = require("../../util/value-util");
class DynamicProp {
    prevValue;
    value;
    callbacks;
    constructor(defaultValue) {
        this.prevValue = (0, value_util_1.clone)(defaultValue);
        this.value = (0, value_util_1.clone)(defaultValue);
        this.callbacks = [];
    }
    currentValue() {
        return (0, value_util_1.clone)(this.value);
    }
    onChange(callback) {
        this.callbacks.push(callback);
        this.callbacks.forEach((callback) => callback(this.value, this.prevValue));
    }
    onElementChange(elementRef, callback) {
        elementRef.queueTask((el) => {
            this.onChange(callback(el));
        });
    }
    set(value) {
        this.prevValue = (0, value_util_1.clone)(this.value);
        this.value = (0, value_util_1.clone)(value);
        this.callbacks.forEach((callback) => callback(this.value, this.prevValue));
    }
}
exports.default = DynamicProp;
