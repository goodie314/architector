export const ErrorMessages = {
    Blueprint: {
        duplicateAttributeKey: (key: string) =>
            `Cannot have duplicate attribute names set on element. Name: ${key}`,
        attemptToBuildFragmentAsBlueprint:
            'Cannot build this element as it is a fragment. Call Blueprint.buildFragment instead',
        attemptToBuildBlueprintAsFragment:
            'Cannot build this element as it is a blueprint. Call Blueprint.build instead',
    },
};
