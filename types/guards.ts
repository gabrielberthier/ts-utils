export const isDefinedObject = <T extends object>(data: object): data is Exclude<T, undefined> => {
    return !Object.entries(data).some((el) => el === undefined);
};