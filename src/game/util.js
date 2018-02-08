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

const debugRender = obj => {
    //const text = JSON.stringify(obj);
    // const width = 66;
    // for (let i = 0; i < text.length / width; i++) {
    //     const substr = text.substr(i * width, (i + 1) * width);
    //     game.debug.text(substr, 2, 14 + i * 16, "#ff0000");
    // }

    const keys = Object.keys(obj);
    let text = "";
    let parts = keys.map(k => `${k}: ${obj[k]}`);

    for (let i = 0; i < parts.length; i++) {
        game.debug.text(parts[i], 2, 14 + i * 16, "#ff0000");
    }
};

export { now, isNumber, isBool, isString, matchingProps, debugRender };