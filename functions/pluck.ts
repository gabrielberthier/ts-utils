export const pluckDeep = (key: string) => (obj: any) => key.split('.').reduce((accum, key) => accum[key], obj)

export const excludeKey = <T extends Record<string, unknown>, K extends keyof T>(obj: T, key: K) =>
  Object.fromEntries(Object.entries(obj).filter(([i]) => i !== key));
