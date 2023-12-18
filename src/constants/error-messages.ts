export const ErrorMessages = {
    BlueprintList: {
        duplicateId: (id: any) =>
            `Cannot have duplicate ids in described list. Duplicate id: ${id}`,
        replaceByIdError: (id: any) =>
            `Cannot update nonexistent id. Id: ${id}`,
        replaceByIndexError: (index: number) =>
            `index ${index} is outside of the number of rendered elements`,
        removeError: (id: any) => `Cannot remove nonexistent id. Id: ${id}`,
    },
    Blueprint: {
        duplicateAttributeKey: (key: string) =>
            `Cannot have duplicate attribute names set on element. Name: ${key}`,
    },
};
