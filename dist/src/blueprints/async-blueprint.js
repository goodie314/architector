"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blueprint_component_1 = require("./blueprint-component");
const blueprint_1 = require("./blueprint");
const element_ref_1 = __importDefault(require("./utils/element-ref"));
const blueprint_builder_1 = require("../structure/blueprint-builder");
class AsyncBlueprint extends blueprint_component_1.BlueprintComponent {
    promise;
    _waitingView;
    _resolvedView;
    _rejectedView;
    renderRef = new element_ref_1.default();
    constructor(promise) {
        super();
        this.promise = promise;
        this._waitingView = blueprint_1.Blueprint.Fragment();
    }
    waitingView(blueprint) {
        this._waitingView = blueprint;
        return this;
    }
    resolvedView(callback) {
        this._resolvedView = callback;
        return this;
    }
    rejectedView(callback) {
        this._rejectedView = callback;
        return this;
    }
    compose() {
        this.promise
            .then((value) => this.renderRef.get().then((elem) => {
            elem.innerHTML = '';
            const updatedView = blueprint_builder_1.BlueprintBuilder.build(this._resolvedView(value));
            elem.append(updatedView);
        }))
            .catch((err) => this.renderRef.get().then((elem) => {
            if (this._rejectedView) {
                elem.innerHTML = '';
                const updatedView = blueprint_builder_1.BlueprintBuilder.build(this._rejectedView(err));
                elem.append(updatedView);
            }
        }));
        return this._waitingView.ref(this.renderRef);
    }
}
exports.default = AsyncBlueprint;
