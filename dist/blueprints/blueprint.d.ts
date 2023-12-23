import { BlueprintAttributes } from '../models/blueprint-attributes';
import ElementRef from './utils/element-ref';
import { EventHandler } from '../types/event-handler';
import DynamicProp from './utils/dynamic-prop';
import { BlueprintComponent } from './blueprint-component';
export declare class Blueprint {
    private readonly _tagName;
    private _isFragment;
    private readonly _plans;
    private elementRef;
    private readonly selfRef;
    private dynamicClassNames;
    constructor(tagName: string);
    get tagName(): string;
    get plans(): BlueprintAttributes;
    get isFragment(): boolean;
    id(value: string | DynamicProp<string>): this;
    classNames(...values: (string | DynamicProp<string>)[]): this;
    attribute(name: string, value?: string | DynamicProp<string>): this;
    text(text: string | DynamicProp<string>): this;
    append(...components: (Blueprint | BlueprintComponent | string)[]): this;
    ref(elementRef: ElementRef): this;
    addEventListener(eventName: string, handler: EventHandler): this;
    click(eventHandler: EventHandler): this;
    setElement(element: HTMLElement): void;
    static Fragment(...blueprints: Blueprint[]): Blueprint;
}
