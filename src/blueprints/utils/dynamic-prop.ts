import ElementRef from './element-ref';

export default class DynamicProp<T> {
    private value: T;
    private callbacks: ((value: T) => void)[];

    constructor(defaultValue?: T) {
        this.value = defaultValue;
        this.callbacks = [];
    }

    onChange(callback: (value: T) => void) {
        this.callbacks.push(callback);
        this.callbacks.forEach((callback) => callback(this.value));
    }

    onElementChange(
        elementRef: ElementRef,
        callback: (element: HTMLElement) => (value: T) => void,
    ) {
        elementRef.queueTask((el) => {
            this.onChange(callback(el));
        });
    }

    set(value: T) {
        this.value = value;
        this.callbacks.forEach((callback) => callback(this.value));
    }
}
