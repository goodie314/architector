"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = void 0;
exports.ErrorMessages = {
    Blueprint: {
        duplicateAttributeKey: (key) => `Cannot have duplicate attribute names set on element. Name: ${key}`,
        attemptToBuildFragmentAsBlueprint: 'Cannot build this element as it is a fragment. Call Blueprint.buildFragment instead',
        attemptToBuildBlueprintAsFragment: 'Cannot build this element as it is a blueprint. Call Blueprint.build instead',
    },
    BlueprintService: {
        noSuchServiceTask: (serviceName, name) => `Service ${serviceName} does not have a registered function ${name}`,
    },
};
