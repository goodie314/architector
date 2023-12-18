export default class ElementRef<T extends HTMLElement = HTMLElement> {
    private readonly element: Promise<T>;
    private onLoaded: (element: T) => void;
    private taskQueue: ((element: T) => void)[];
    private elementSet: T;

    constructor() {
        this.element = new Promise<T>((resolve) => (this.onLoaded = resolve));
        this.taskQueue = [];
    }

    get() {
        return this.element;
    }

    queueTask(task: (elem: T) => void) {
        this.taskQueue.push(task);
        if (this.elementSet) {
            this.taskQueue.forEach((task) => task(this.elementSet));
        }
    }

    set(element: T) {
        this.onLoaded(element);
        this.taskQueue.forEach((task) => task(element));
        this.elementSet = element;
    }
}
