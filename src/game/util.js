import { effects } from "../enums/effects";
import { gameConfig } from "./config";

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

const animationDuration = (frames, framerate) => {
    const timePerFrame = 1000 / framerate;

    const duration = frames * timePerFrame;

    return duration;
};

const dist = (a, b) => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

const setBounds = (sprite, bounds) => {
    const { top, right, bottom, left } = bounds;

    const width = right - left;
    const height = bottom - top;

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

const playSound = id => {
    const sound = game.add.sound(id);
    sound.play();
};

const playEffect = (id, x, y) => {
    let frames = [];
    let anchorx = 0.5;
    let anchory = 0.5;

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
            anchory = 1;
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

    sprite.anchor.setTo(anchorx, anchory);
    sprite.scale.setTo(2, 2);

    const animation = sprite.animations.add(
        "default",
        frames,
        gameConfig.FRAMERATE,
        false
    );

    animation.killOnComplete = true;

    sprite.animations.play("default");
};

const randomBetween = (min, max) => {
    if (min >= max) {
        return min;
    }

    return min + Math.random() * (max - min);
};

function drawStylizedText(text, x, y) {
    const offsetX = 2;
    const offsetY = 2;
    const shadowLabel = game.add.bitmapText(
        x + offsetX,
        y + offsetY,
        "mduel",
        text,
        32
    );
    shadowLabel.tint = 0x565656;

    const mainLabel = game.add.bitmapText(x, y, "mduel", text, 32);
    mainLabel.tint = 0xac4aac;
}

const debugRender = obj => {
    //const text = JSON.stringify(obj);
    // const width = 66;
    // for (let i = 0; i < text.length / width; i++) {
    //     const substr = text.substr(i * width, (i + 1) * width);
    //     game.debug.text(substr, 2, 14 + i * 16, "#ff0000");
    // }
    if (obj === null) {
        game.debug.text("null", 2, 14, "#ff0000");
        return;
    }

    if (typeof obj !== "object") {
        game.debug.text(obj + "", 2, 14, "#ff0000");
    }

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
    animationDuration,
    dist,
    setBounds,
    exceptIndex,
    removeAtIndex,
    playSound,
    playEffect,
    randomBetween,
    drawStylizedText,
    debugRender
};
