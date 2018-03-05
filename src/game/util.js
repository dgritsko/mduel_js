import { effects } from "../enums/effects";
import { playerConfig } from "./config";

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

    const spriteWidth = Math.abs(sprite.width);
    const spriteHeight = Math.abs(sprite.height);

    sprite.body.setSize(
        width,
        height,
        spriteWidth / 2 + left,
        spriteHeight / 2 + top
    );
};

const exceptIndex = (items, index) => {
    const before = items.slice(0, index);
    const after = items.slice(index + 1);

    return [...before, ...after];
};

const removeAtIndex = (items, index) => {
    items.splice(index, 1);
};

const playEffect = (id, x, y) => {
    let frames = [];
    switch (id) {
        case effects.GRAY_PUFF:
            frames = [0, 1, 2, 3];
            break;
        case effects.SPLASH:
            frames = [4, 5, 6, 7];
            break;
        case effects.VOLTS:
            frames = [8, 9];
            break;
        case effects.MINE:
            frames = [10, 11, 12];
            break;
        case effects.BOOMERANG:
            frames = [13, 14, 15];
            break;
        case effects.DIE:
            frames = [16, 17];
            break;
        case effects.PURPLE_PUFF:
            frames = [18, 19, 20];
            break;
        case effects.GREEN_PUFF:
            frames = [21, 22, 23];
            break;
    }

    const sprite = game.add.sprite(x, y, "effects", frames[0]);

    sprite.anchor.setTo(0.5);

    const animation = sprite.animations.add(
        "default",
        frames,
        playerConfig.FRAMERATE,
        false
    );

    animation.killOnComplete = true;

    sprite.animations.play("default");
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
    exceptIndex,
    removeAtIndex,
    playEffect,
    debugRender
};
