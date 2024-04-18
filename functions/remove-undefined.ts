import { isDefinedObject } from "../types/guards";

export const removeUndefined = <T extends {[key: string]: any}>(data: T): T | Exclude<T, undefined> => {
    const undefinedsRemovidos = Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .reduce((obj: {[key: string]: any}, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  
    if (isDefinedObject<T>(undefinedsRemovidos)) {
      return undefinedsRemovidos;
    }
  
    return data;
  };