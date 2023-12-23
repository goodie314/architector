"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultHtmlTemplate = void 0;
const blueprint_component_1 = require("./blueprint-component");
const blueprint_1 = require("./blueprint");
class DefaultHtmlTemplate extends blueprint_component_1.BlueprintComponent {
    title;
    _language;
    _externalStyles;
    _charset;
    _viewport;
    _bodyContent;
    constructor(title) {
        super();
        this.title = title;
        this._language = 'en';
        this._externalStyles = [];
        this._charset = 'UTF-8';
        this._viewport = 'width=device-width, initial-scale=1.0';
        this._bodyContent = [];
    }
    language(lang) {
        this._language = lang;
        return this;
    }
    externalStyle(url) {
        this._externalStyles.push(url);
        return this;
    }
    charset(_charset) {
        this._charset = _charset;
        return this;
    }
    viewport(_viewport) {
        this._viewport = _viewport;
        return this;
    }
    bodyElement(bodyElem) {
        this._bodyContent.push(bodyElem);
        return this;
    }
    compose() {
        const styles = this._externalStyles.map((url) => this.blueprint('style').attribute('href', url));
        return blueprint_1.Blueprint.Fragment(this.blueprint('!DOCTYPE').attribute('HTML'), this.blueprint('html')
            .attribute('lang', this._language)
            .append(this.blueprint('head').append(this.blueprint('meta').attribute('charset', this._charset), this.blueprint('meta')
            .attribute('name', 'viewport')
            .attribute('content', this._viewport), this.blueprint('title').text(this.title), ...styles), this.blueprint('body').append(...this._bodyContent)));
    }
}
exports.DefaultHtmlTemplate = DefaultHtmlTemplate;
