"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlueprintApplication = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const cwd_1 = __importDefault(require("../util/cwd"));
const esbuild = __importStar(require("esbuild"));
const file_util_1 = require("../util/file-util");
const blueprint_1 = require("../blueprints/blueprint");
const default_html_template_1 = require("../blueprints/default-html-template");
const blueprint_html_builder_1 = __importDefault(require("./blueprint-html-builder"));
class BlueprintApplication {
    pageMap;
    outputDirName;
    template;
    constructor(title) {
        this.pageMap = new Map();
        this.outputDirName = 'bundle';
        this.template = new default_html_template_1.DefaultHtmlTemplate(title).bodyElement(new blueprint_1.Blueprint('script').attribute('src', 'index.js'));
    }
    addDefaultHtml(template) {
        this.template = template;
    }
    addPage(url, describablePageLocation) {
        if (this.pageMap.has(url)) {
            throw new Error(`URL ${url} is already mapped`);
        }
        this.validateURL(url);
        const pagePath = path.join(cwd_1.default, describablePageLocation);
        if (!fs.existsSync(pagePath)) {
            throw new Error(`Could not find describable page at ${pagePath}`);
        }
        this.pageMap.set(url, pagePath);
        return this;
    }
    validateURL(url) {
        if (!url.startsWith('/')) {
            throw new Error(`${url} is invalid. Paths must start with /`);
        }
        else if (!/^[a-zA-Z0-9_\-/]+$/.test(url)) {
            throw new Error(`${url} is invalid. Urls can only contain letters, numbers, underscore, dashes, or forward slashes`);
        }
    }
    outputDir(dirName) {
        this.outputDirName = dirName;
        return this;
    }
    async build() {
        if (this.pageMap.size === 0) {
            throw new Error('Cannot build a describable application without any pages. Call addPage before calling build.');
        }
        const template = (0, blueprint_html_builder_1.default)(this.template);
        const builds = Array.from(this.pageMap.keys()).map((url) => {
            const location = this.pageMap.get(url);
            const outputLocation = path.join(cwd_1.default, this.outputDirName, url);
            (0, file_util_1.writeFileSafe)(path.join(outputLocation, 'index.html'), template);
            return esbuild.build({
                entryPoints: [location],
                bundle: true,
                minify: true,
                logLevel: 'info',
                outfile: path.join(outputLocation, 'index.js'),
            });
        });
        await Promise.all(builds);
    }
}
exports.BlueprintApplication = BlueprintApplication;
