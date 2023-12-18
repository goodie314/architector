export default class DynamicProp<T> {
    private value: T;
    private callback: (value: T) => void

    constructor(defaultValue?: T) {
        this.value = defaultValue;
        this.callback = (value: T) => {}
    }

    onChange(callback: (value: T) => void) {
        this.callback = callback;
        this.callback(this.value);
    }

    set(value: T) {
        this.value = value;
        this.callback(this.value);
    }
}