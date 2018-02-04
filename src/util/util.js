const now = () => new Date().getTime();

const isNumber = value => typeof value === "number";
const isBool = value => typeof value === "boolean";
const isString = value => typeof value === "string";

const matchingProps = (state, test) => {
    const keys = Object.keys(test);

    return {
        actual: keys.filter(k => {
            if (Array.isArray(test[k])) {
                return test[k].indexOf(state[k]) > -1;
            }

            return state[k] === test[k];
        }).length,
        target: keys.length
    };
};

export { now, isNumber, isBool, isString, matchingProps };
