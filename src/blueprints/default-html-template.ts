import BlueprintComponent from './blueprint-component';
import { Blueprint } from './blueprint';
import { BlueprintRenderable } from '../models/types';

export default class DefaultHtmlTemplate extends BlueprintComponent {
    private readonly title: string;
    private _language: string;
    private _externalStyles: string[];
    private _charset: string;
    private _viewport: string;
    private readonly _bodyContent: BlueprintRenderable[];

    constructor(title: string) {
        super();
        this.title = title;
        this._language = 'en';
        this._externalStyles = [];
        this._charset = 'UTF-8';
        this._viewport = 'width=device-width, initial-scale=1.0';
        this._bodyContent = [];
    }

    language(lang: string) {
        this._language = lang;
        return this;
    }

    externalStyle(url: string) {
        this._externalStyles.push(url);
        return this;
    }

    charset(_charset: string) {
        this._charset = _charset;
        return this;
    }

    viewport(_viewport: string) {
        this._viewport = _viewport;
        return this;
    }

    bodyElement(bodyElem: BlueprintRenderable) {
        this._bodyContent.push(bodyElem);
        return this;
    }

    compose(): Blueprint {
        const styles = this._externalStyles.map((url) =>
            this.blueprint('style').attribute('href', url),
        );

        return Blueprint.Fragment(
            this.blueprint('!DOCTYPE').attribute('HTML'),
            this.blueprint('html')
                .attribute('lang', this._language)
                .append(
                    this.blueprint('head').append(
                        this.blueprint('meta').attribute(
                            'charset',
                            this._charset,
                        ),
                        this.blueprint('meta')
                            .attribute('name', 'viewport')
                            .attribute('content', this._viewport),
                        this.blueprint('title').text(this.title),
                        ...styles,
                    ),
                    this.blueprint('body').append(...this._bodyContent),
                ),
        );
    }
}
