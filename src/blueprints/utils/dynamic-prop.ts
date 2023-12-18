import ElementRef from './element-ref';

export default class DynamicProp<T> {
    private prevValue: T;
    private value: T;
    private callbacks: ((value: T, prev: T) => void)[];

    constructor(defaultValue?: T) {
        this.prevValue = defaultValue;
        this.value = defaultValue;
        this.callbacks = [];
    }

    currentValue() {
        return this.value;
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
        this.prevValue = this.value;
        this.value = value;
        this.callbacks.forEach((callback) =>
            callback(this.value, this.prevValue),
        );
    }
}
