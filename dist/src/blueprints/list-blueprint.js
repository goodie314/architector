"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blueprint_component_1 = require("./blueprint-component");
const element_ref_1 = __importDefault(require("./utils/element-ref"));
const blueprint_builder_1 = require("../structure/blueprint-builder");
const value_util_1 = require("../util/value-util");
class ListBlueprint extends blueprint_component_1.BlueprintComponent {
    blueprintMapper;
    idMapper;
    containerRef = new element_ref_1.default();
    order;
    elementMap;
    constructor(data, blueprintMapper, idMapper) {
        super();
        this.blueprintMapper = blueprintMapper;
        this.idMapper =
            idMapper ??
                ((dataElement) => {
                    // @ts-ignore
                    if (dataElement['id'] == null) {
                        throw new Error(`Data elements do not have an id prop. You must pass in a mapping function to produce an id`);
                    }
                    // @ts-ignore
                    return dataElement['id'];
                });
        this.order = [];
        this.elementMap = new Map();
        data.onElementChange(this.containerRef, this.handleElementReady.bind(this));
    }
    handleElementReady(element) {
        return (values, prevValues) => {
            const safeGetOrder = (index) => index < this.order.length ? this.order[index] : null;
            const updatedOrder = values.map(this.idMapper);
            const updatedMap = new Map();
            const updatedElements = [];
            const prevValueMap = new Map();
            prevValues.forEach((val) => prevValueMap.set(this.idMapper(val), val));
            for (let i = 0; i < updatedOrder.length; i++) {
                const id = updatedOrder[i];
                const oldId = safeGetOrder(i);
                const data = values[i];
                if (id !== oldId) {
                    if (this.elementMap.has(id)) {
                        const updatedElement = (0, value_util_1.compareValues)(data, prevValueMap.get(id))
                            ? this.elementMap.get(id)
                            : blueprint_builder_1.BlueprintBuilder.build(this.blueprintMapper(data));
                        updatedMap.set(id, updatedElement);
                        updatedElements.push(updatedElement);
                    }
                    else {
                        const updatedElement = blueprint_builder_1.BlueprintBuilder.build(this.blueprintMapper(data));
                        updatedMap.set(id, updatedElement);
                        updatedElements.push(updatedElement);
                    }
                }
                else {
                    const updatedElement = (0, value_util_1.compareValues)(data, prevValueMap.get(id))
                        ? this.elementMap.get(id)
                        : blueprint_builder_1.BlueprintBuilder.build(this.blueprintMapper(data));
                    updatedMap.set(id, updatedElement);
                    updatedElements.push(updatedElement);
                }
            }
            this.order
                .filter((id) => !updatedMap.has(id))
                .map((id) => this.elementMap.get(id))
                .forEach((el) => el.remove());
            this.order = updatedOrder;
            this.elementMap = updatedMap;
            element.innerHTML = '';
            updatedElements.forEach((child) => element.append(child));
        };
    }
    compose() {
        return this.fragment().ref(this.containerRef);
    }
}
exports.default = ListBlueprint;
