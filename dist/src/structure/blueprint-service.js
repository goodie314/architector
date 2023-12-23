"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_messages_1 = require("../constants/error-messages");
class BlueprintService {
    serviceName;
    services;
    constructor(serviceName) {
        this.serviceName = serviceName;
        this.services = new Map();
    }
    registerFunction(name, callback) {
        this.services.set(name, callback);
        return this;
    }
    hasFunction(name) {
        return this.services.has(name);
    }
    async callFunction(name, ...params) {
        if (!this.hasFunction(name)) {
            throw new Error(error_messages_1.ErrorMessages.BlueprintService.noSuchServiceTask(this.serviceName, name));
        }
        const fn = this.services.get(name);
        const result = fn(...params);
        if (result instanceof Promise) {
            return await result;
        }
        else {
            return result;
        }
    }
}
exports.default = BlueprintService;
