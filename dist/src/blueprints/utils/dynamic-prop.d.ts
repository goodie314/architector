import ElementRef from './element-ref';
export default class DynamicProp<T> {
    private prevValue;
    private value;
    private callbacks;
    constructor(defaultValue?: T);
    currentValue(): T;
    onChange(callback: (value: T, prev: T) => void): void;
    onElementChange(elementRef: ElementRef, callback: (element: HTMLElement) => (value: T, prev: T) => void): void;
    set(value: T): void;
}
