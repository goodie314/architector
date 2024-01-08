var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/structure/blueprint-application.ts
var blueprint_application_exports = {};
__export(blueprint_application_exports, {
  BlueprintApplication: () => BlueprintApplication
});
module.exports = __toCommonJS(blueprint_application_exports);
var path2 = __toESM(require("path"));
var fs2 = __toESM(require("fs"));

// src/util/cwd.ts
var cwd_default = process.cwd();

// src/structure/blueprint-application.ts
var esbuild = __toESM(require("esbuild"));

// src/util/file-util.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
function writeFileSafe(filePath, content) {
  const { dir } = path.parse(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
}

// src/blueprints/utils/element-ref.ts
var ElementRef = class {
  element;
  onLoaded;
  taskQueue;
  elementSet;
  constructor() {
    this.element = new Promise((resolve) => this.onLoaded = resolve);
    this.taskQueue = [];
  }
  get() {
    return this.element;
  }
  queueTask(task) {
    this.taskQueue.push(task);
    if (this.elementSet) {
      this.taskQueue.forEach((task2) => task2(this.elementSet));
    }
  }
  set(element) {
    this.onLoaded(element);
    this.taskQueue.forEach((task) => task(element));
    this.elementSet = element;
  }
};

// src/util/value-util.ts
function clone(value) {
  const valueType = typeof value;
  if (value instanceof Array) {
    return value.map(clone);
  } else if (valueType === "object") {
    return Object.assign({}, value);
  } else {
    return value;
  }
}

// src/blueprints/utils/dynamic-prop.ts
var DynamicProp = class {
  prevValue;
  value;
  callbacks;
  constructor(defaultValue) {
    this.prevValue = clone(defaultValue);
    this.value = clone(defaultValue);
    this.callbacks = [];
  }
  currentValue() {
    return clone(this.value);
  }
  onChange(callback) {
    this.callbacks.push(callback);
    this.callbacks.forEach(
      (callback2) => callback2(this.value, this.prevValue)
    );
  }
  onElementChange(elementRef, callback) {
    elementRef.queueTask((el) => {
      this.onChange(callback(el));
    });
  }
  set(value) {
    this.prevValue = clone(this.value);
    this.value = clone(value);
    this.callbacks.forEach(
      (callback) => callback(this.value, this.prevValue)
    );
  }
};

// src/constants/error-messages.ts
var ErrorMessages = {
  Blueprint: {
    duplicateAttributeKey: (key) => `Cannot have duplicate attribute names set on element. Name: ${key}`,
    attemptToBuildFragmentAsBlueprint: "Cannot build this element as it is a fragment. Call Blueprint.buildFragment instead",
    attemptToBuildBlueprintAsFragment: "Cannot build this element as it is a blueprint. Call Blueprint.build instead"
  },
  BlueprintService: {
    noSuchServiceTask: (serviceName, name) => `Service ${serviceName} does not have a registered function ${name}`
  }
};

// src/blueprints/blueprint.ts
var Blueprint = class _Blueprint {
  _tagName;
  _isFragment;
  _plans;
  elementRef;
  selfRef = new ElementRef();
  dynamicClassNames;
  constructor(tagName) {
    this._tagName = tagName;
    this._isFragment = false;
    this._plans = {
      classNames: [],
      attributes: {},
      children: [],
      handlers: {}
    };
    this.dynamicClassNames = [];
  }
  get tagName() {
    return this._tagName;
  }
  get plans() {
    return this._plans;
  }
  get isFragment() {
    return this._isFragment;
  }
  id(value) {
    if (value instanceof DynamicProp) {
      value.onElementChange(
        this.selfRef,
        (element) => (value2) => element.id = value2
      );
    } else {
      this._plans.id = value;
    }
    return this;
  }
  classNames(...values) {
    values.forEach((value) => {
      if (value instanceof DynamicProp) {
        this.dynamicClassNames.push(value);
      } else {
        this._plans.classNames.push(value);
      }
    });
    this.dynamicClassNames.forEach((prop) => {
      prop.onElementChange(this.selfRef, (el) => (val, prev) => {
        const keepPrev = this._plans.classNames.some(
          (className) => className === prev
        ) || this.dynamicClassNames.some(
          (otherProp) => otherProp.currentValue() === prev
        );
        if (!keepPrev) {
          el.classList.remove(prev);
        }
        el.classList.add(val);
      });
    });
    return this;
  }
  attribute(name, value) {
    if (this._plans.attributes[name]) {
      throw new Error(
        ErrorMessages.Blueprint.duplicateAttributeKey(name)
      );
    }
    if (value instanceof DynamicProp) {
      value.onElementChange(this.selfRef, (el) => (val) => {
        if (val) {
          el.setAttribute(name, val);
        }
      });
    } else {
      this._plans.attributes[name] = value;
    }
    return this;
  }
  text(text) {
    if (text instanceof DynamicProp) {
      text.onElementChange(
        this.selfRef,
        (el) => (value) => el.textContent = value
      );
    } else {
      this._plans.text = text;
    }
    return this;
  }
  append(...components) {
    components.forEach((component) => this._plans.children.push(component));
    return this;
  }
  ref(elementRef) {
    this.elementRef = elementRef;
    return this;
  }
  addEventListener(eventName, handler) {
    this._plans.handlers[eventName] = handler;
    return this;
  }
  click(eventHandler) {
    return this.addEventListener("click", eventHandler);
  }
  setElement(element) {
    this.selfRef?.set(element);
    this.elementRef?.set(element);
  }
  static Fragment(...blueprints) {
    const fragment = new _Blueprint("fragment");
    blueprints.forEach((blueprint) => fragment.append(blueprint));
    fragment._isFragment = true;
    return fragment;
  }
};

// src/structure/blueprint-context.ts
var BlueprintContext = class _BlueprintContext {
  name;
  component;
  parentContext;
  resolveParent;
  serviceMap;
  constructor(name = "default") {
    this.name = name;
    this.serviceMap = /* @__PURE__ */ new Map();
    this.parentContext = new Promise(
      (resolve) => this.resolveParent = resolve
    );
  }
  attachComponent(component, name) {
    this.component = component;
    this.name = name;
  }
  registerService(service) {
    this.serviceMap.set(service.serviceName, service);
    return this;
  }
  queueTask(serviceName, taskName, callback, ...params) {
    if (!this.serviceMap.has(serviceName)) {
      this.parentContext.then(
        (parent) => parent.queueTask(serviceName, taskName, callback, ...params)
      );
    } else {
      const service = this.serviceMap.get(serviceName);
      if (service.hasFunction(taskName)) {
        service.callFunction(taskName, ...params).then(callback);
      } else {
        this.parentContext.then(
          (parent) => parent.queueTask(
            serviceName,
            taskName,
            callback,
            ...params
          )
        );
      }
    }
  }
  static createContext(contextName = "default") {
    return new _BlueprintContext(contextName);
  }
  static attachContext(parent, child) {
    child.resolveParent(parent);
    return child;
  }
};

// src/blueprints/blueprint-component.ts
var BlueprintComponent = class {
  context;
  constructor(componentName = "default") {
    if (!this.context) {
      this.context = BlueprintContext.createContext(componentName);
    }
    if (componentName) {
      this.context.attachComponent(this, componentName);
    }
  }
  // utility methods to generate blueprints
  blueprint(tagName) {
    return new Blueprint(tagName);
  }
  fragment(...blueprints) {
    return Blueprint.Fragment(...blueprints);
  }
  div() {
    return this.blueprint("div");
  }
  span() {
    return this.blueprint("span");
  }
  h(number) {
    return this.blueprint(`h${number}`);
  }
  ul() {
    return this.blueprint("ul");
  }
  li(text) {
    return this.blueprint("li").text(text);
  }
  form() {
    return this.blueprint("form");
  }
  label(forName) {
    const label = this.blueprint("label");
    if (forName) {
      label.attribute("for", forName);
    }
    return label;
  }
  button(text) {
    return this.blueprint("button").text(text);
  }
  input(type, name) {
    const input = this.blueprint("input");
    if (type) {
      input.attribute("type", type);
    }
    if (name) {
      input.attribute("name", name);
    }
    return input;
  }
  checkbox() {
    return this.input("checkbox");
  }
};

// src/blueprints/default-html-template.ts
var DefaultHtmlTemplate = class extends BlueprintComponent {
  title;
  _language;
  _externalStyles;
  _charset;
  _viewport;
  _bodyContent;
  constructor(title) {
    super();
    this.title = title;
    this._language = "en";
    this._externalStyles = [];
    this._charset = "UTF-8";
    this._viewport = "width=device-width, initial-scale=1.0";
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
    const styles = this._externalStyles.map(
      (url) => this.blueprint("style").attribute("href", url)
    );
    return Blueprint.Fragment(
      this.blueprint("!DOCTYPE").attribute("HTML"),
      this.blueprint("html").attribute("lang", this._language).append(
        this.blueprint("head").append(
          this.blueprint("meta").attribute(
            "charset",
            this._charset
          ),
          this.blueprint("meta").attribute("name", "viewport").attribute("content", this._viewport),
          this.blueprint("title").text(this.title),
          ...styles
        ),
        this.blueprint("body").append(...this._bodyContent)
      )
    );
  }
};

// src/structure/blueprint-html-builder.ts
var selfClosingTags = ["meta"];
function BlueprintHTMLBuilder(blueprint) {
  function builderHelper(blueprint2, tabs = 0) {
    const parts = Array(tabs).fill("	");
    if (blueprint2 instanceof String || typeof blueprint2 === "string") {
      parts.push(blueprint2);
      return parts.join("");
    } else if (blueprint2 instanceof BlueprintComponent) {
      blueprint2 = blueprint2.compose();
    }
    blueprint2 = blueprint2;
    if (blueprint2.isFragment) {
      return blueprint2.plans.children.map((child) => builderHelper(child, tabs)).join("\n");
    }
    parts.push(`<${blueprint2.tagName}`);
    const plans = blueprint2.plans;
    if (plans.id) {
      parts.push(` id="${plans.id}"`);
    }
    if (plans.classNames.length) {
      parts.push(` class="${plans.classNames.join(" ")}"`);
    }
    Object.entries(plans.attributes).map(([key, value]) => {
      return value ? ` ${key}="${value}"` : ` ${key}`;
    }).forEach((attribute) => parts.push(attribute));
    if (blueprint2.tagName.toLowerCase() === "!doctype") {
      parts.push(">");
      return parts.join("");
    }
    if (selfClosingTags.includes(blueprint2.tagName)) {
      parts.push("/>");
      return parts.join("");
    }
    parts.push(">");
    if (plans.children.length) {
      parts.push("\n");
    }
    parts.push(
      plans.children.map((child) => builderHelper(child, tabs + 1)).join("\n")
    );
    parts.push("\n");
    if (plans.text) {
      parts.push(
        ...Array(tabs + 1).fill("	").join("")
      );
      parts.push(plans.text);
      parts.push("\n");
    }
    parts.push(...Array(tabs).fill("	").join(""));
    parts.push(`</${blueprint2.tagName}>`);
    return parts.join("");
  }
  return builderHelper(blueprint);
}

// src/structure/blueprint-application.ts
var BlueprintApplication = class {
  pageMap;
  outputDirName;
  template;
  constructor(title) {
    this.pageMap = /* @__PURE__ */ new Map();
    this.outputDirName = "bundle";
    this.template = new DefaultHtmlTemplate(title).bodyElement(
      new Blueprint("script").attribute("src", "index.js")
    );
  }
  addDefaultHtml(template) {
    this.template = template;
  }
  addPage(url, describablePageLocation) {
    if (this.pageMap.has(url)) {
      throw new Error(`URL ${url} is already mapped`);
    }
    this.validateURL(url);
    const pagePath = path2.join(cwd_default, describablePageLocation);
    if (!fs2.existsSync(pagePath)) {
      throw new Error(`Could not find describable page at ${pagePath}`);
    }
    this.pageMap.set(url, pagePath);
    return this;
  }
  validateURL(url) {
    if (!url.startsWith("/")) {
      throw new Error(`${url} is invalid. Paths must start with /`);
    } else if (!/^[a-zA-Z0-9_\-/]+$/.test(url)) {
      throw new Error(
        `${url} is invalid. Urls can only contain letters, numbers, underscore, dashes, or forward slashes`
      );
    }
  }
  outputDir(dirName) {
    this.outputDirName = dirName;
    return this;
  }
  async build() {
    if (this.pageMap.size === 0) {
      throw new Error(
        "Cannot build a describable application without any pages. Call addPage before calling build."
      );
    }
    const template = BlueprintHTMLBuilder(this.template);
    const builds = Array.from(this.pageMap.keys()).map((url) => {
      const location = this.pageMap.get(url);
      const outputLocation = path2.join(cwd_default, this.outputDirName, url);
      writeFileSafe(path2.join(outputLocation, "index.html"), template);
      return esbuild.build({
        entryPoints: [location],
        bundle: true,
        minify: true,
        logLevel: "info",
        outfile: path2.join(outputLocation, "index.js")
      });
    });
    await Promise.all(builds);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlueprintApplication
});
