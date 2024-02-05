export const isStringLiteral = (value: string | unknown): value is string =>
	typeof value === 'string'

export const isStringObject = (value: string | unknown): value is String =>
	value instanceof String;

export const isAnyString = (value: string | unknown) :value is string|String =>
	isStringLiteral(value) || isStringObject(value);

export const isString = isStringLiteral;
