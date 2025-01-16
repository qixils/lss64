type JsonParams = Parameters<typeof JSON.stringify>

export const safeStringify = (obj: JsonParams[0] | undefined, resolver?: JsonParams[1], space?: JsonParams[2]): string | undefined => {
  if (obj === undefined) return undefined
  return JSON.stringify(obj, resolver, space)
}
