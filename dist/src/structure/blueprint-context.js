"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BlueprintContext {
    name;
    component;
    parentContext;
    resolveParent;
    serviceMap;
    constructor(name = 'default') {
        this.name = name;
        this.serviceMap = new Map();
        this.parentContext = new Promise((resolve) => (this.resolveParent = resolve));
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
            this.parentContext.then((parent) => parent.queueTask(serviceName, taskName, callback, ...params));
        }
        else {
            const service = this.serviceMap.get(serviceName);
            if (service.hasFunction(taskName)) {
                service.callFunction(taskName, ...params).then(callback);
            }
            else {
                this.parentContext.then((parent) => parent.queueTask(serviceName, taskName, callback, ...params));
            }
        }
    }
    static createContext(contextName = 'default') {
        return new BlueprintContext(contextName);
    }
    static attachContext(parent, child) {
        child.resolveParent(parent);
        return child;
    }
}
exports.default = BlueprintContext;
