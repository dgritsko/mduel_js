const now = () => new Date().getTime()

const isNumber = value => typeof(value) === 'number';
const isBool = value => typeof(value) === 'boolean';
const isString = value => typeof(value) === 'string';

export { now, isNumber, isBool, isString };