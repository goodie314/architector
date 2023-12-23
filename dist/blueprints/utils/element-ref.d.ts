export default class ElementRef<T extends HTMLElement = HTMLElement> {
    private readonly element;
    private onLoaded;
    private taskQueue;
    private elementSet;
    constructor();
    get(): Promise<T>;
    queueTask(task: (elem: T) => void): void;
    set(element: T): void;
}
