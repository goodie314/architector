export const ErrorMessages = {
    DescribedList: {
        duplicateId: (id: any) =>
            `Cannot have duplicate ids in described list. Duplicate id: ${id}`,
        replaceByIdError: (id: any) =>
            `Cannot update nonexistent id. Id: ${id}`,
        replaceByIndexError: (index: number) =>
            `index ${index} is outside of the number of rendered elements`,
        removeError: (id: any) => `Cannot remove nonexistent id. Id: ${id}`,
    },
};
