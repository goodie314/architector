import ElementRef from './element-ref';
import { clone } from '../../util/value-util';

export default class DynamicProp<T> {
    private prevValue: T;
    private value: T;
    private callbacks: ((value: T, prev: T) => void)[];

    constructor(defaultValue?: T) {
        this.prevValue = clone(defaultValue);
        this.value = clone(defaultValue);
        this.callbacks = [];
    }

    currentValue() {
        return clone(this.value);
    }

    onChange(callback: (value: T, prev: T) => void) {
        this.callbacks.push(callback);
        this.callbacks.forEach((callback) =>
            callback(this.value, this.prevValue),
        );
    }

    onElementChange(
        elementRef: ElementRef,
        callback: (element: HTMLElement) => (value: T, prev: T) => void,
    ) {
        elementRef.queueTask((el) => {
            this.onChange(callback(el));
        });
    }

    set(value: T) {
        this.prevValue = clone(this.value);
        this.value = clone(value);
        this.callbacks.forEach((callback) =>
            callback(this.value, this.prevValue),
        );
    }
}
