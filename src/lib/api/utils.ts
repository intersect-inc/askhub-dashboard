const camelToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export const convertToSnakeCase = <T>(input: T): T => {
  if (Array.isArray(input)) {
    return input.map(convertToSnakeCase) as T
  } else if (typeof input === 'object' && input !== null) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        camelToSnakeCase(key),
        convertToSnakeCase(value),
      ])
    ) as T
  }
  return input
}
