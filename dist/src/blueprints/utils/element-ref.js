"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElementRef {
    element;
    onLoaded;
    taskQueue;
    elementSet;
    constructor() {
        this.element = new Promise((resolve) => (this.onLoaded = resolve));
        this.taskQueue = [];
    }
    get() {
        return this.element;
    }
    queueTask(task) {
        this.taskQueue.push(task);
        if (this.elementSet) {
            this.taskQueue.forEach((task) => task(this.elementSet));
        }
    }
    set(element) {
        this.onLoaded(element);
        this.taskQueue.forEach((task) => task(element));
        this.elementSet = element;
    }
}
exports.default = ElementRef;
