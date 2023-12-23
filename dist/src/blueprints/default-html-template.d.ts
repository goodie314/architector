import { BlueprintComponent } from './blueprint-component';
import { Blueprint } from './blueprint';
import { BlueprintRenderable } from '../models/types';
export declare class DefaultHtmlTemplate extends BlueprintComponent {
    private readonly title;
    private _language;
    private _externalStyles;
    private _charset;
    private _viewport;
    private readonly _bodyContent;
    constructor(title: string);
    language(lang: string): this;
    externalStyle(url: string): this;
    charset(_charset: string): this;
    viewport(_viewport: string): this;
    bodyElement(bodyElem: BlueprintRenderable): this;
    compose(): Blueprint;
}
