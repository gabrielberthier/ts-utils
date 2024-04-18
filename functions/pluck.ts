export const pluckDeep = (key: string) => (obj: any) => key.split('.').reduce((accum, key) => accum[key], obj)
