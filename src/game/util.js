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
            } else if (typeof test[k] === "function") {
                return test[k](state);
            }

            return state[k] === test[k];
        }).length,
        target: keys.length
    };
};

const dist = (a, b) => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

const setBounds = (sprite, bounds) => {
    const { top, right, bottom, left } = bounds;

    const width = Math.abs(right) + Math.abs(left);
    const height = Math.abs(top) + Math.abs(bottom);

    sprite.body.setSize(
        width,
        height,
        sprite.width / 2 + left,
        sprite.height / 2 + top
    );
};

const debugRender = obj => {
    //const text = JSON.stringify(obj);
    // const width = 66;
    // for (let i = 0; i < text.length / width; i++) {
    //     const substr = text.substr(i * width, (i + 1) * width);
    //     game.debug.text(substr, 2, 14 + i * 16, "#ff0000");
    // }

    const keys = Object.keys(obj);
    let parts = keys.map(k => `${k}: ${obj[k]}`);

    for (let i = 0; i < parts.length; i++) {
        game.debug.text(parts[i], 2, 14 + i * 16, "#ff0000");
    }
};

export {
    now,
    isNumber,
    isBool,
    isString,
    matchingProps,
    dist,
    setBounds,
    debugRender
};
