const expandBool = bool => {
    return _ => bool;
};

const expandObj = obj => {
    const { r, g, b } = obj;
    return px => px.r === r && px.g === g && px.b === b;
};

const parseColor = str => {
    str = str[0] === "#" ? str.substring(1) : str;

    const r = parseInt(str.substring(0, 2), 16);
    const g = parseInt(str.substring(2, 4), 16);
    const b = parseInt(str.substring(4, 6), 16);
    return { r, g, b };
};

const expandStr = str => {
    return expandObj(parseColor(str));
};

const expandMatch = match => {
    switch (typeof match) {
        case "boolean":
            return expandBool(match);
        case "string":
            return expandStr(match);
        case "object":
            return expandObj(match);
        case "function":
            return match;
        default:
            console.error(`Type not supported: ${typeof match}`);
    }
};

const applyColor = (px, color) => {
    px.r = typeof color.r === "number" ? color.r : px.r;
    px.g = typeof color.g === "number" ? color.g : px.g;
    px.b = typeof color.b === "number" ? color.b : px.b;
    px.a = typeof color.a === "number" ? color.a : px.a;
};

const expandApply = apply => {
    switch (typeof apply) {
        case "string":
            return px => {
                const color = parseColor(apply);
                applyColor(px, color);
            };
        case "object":
            return px => {
                applyColor(px, apply);
            };
        case "function":
            return apply;
    }
};

const buildPixelModificationFunction = rules => {
    const expanded = rules.map(rule => {
        const match = expandMatch(rule.match);
        const apply = expandApply(rule.apply);

        return { match, apply };
    });

    return px => {
        expanded.forEach(element => {
            if (element.match(px)) {
                element.apply(px);
            }
        });
        return px;
    };
};

const createModifiedSpritesheet = (spriteName, newSpriteName, processPixel) => {
    const firstFrame = game.cache.getFrameData(spriteName).getFrame(0);
    const frameCount = game.cache.getFrameCount(spriteName);

    const frameWidth = firstFrame.width;
    const frameHeight = firstFrame.height;

    const grayData = makeBitmap(spriteName, processPixel);

    game.cache.addSpriteSheet(
        newSpriteName,
        null,
        grayData.canvas,
        frameWidth,
        frameHeight,
        frameCount
    );
};

const makeBitmap = (srcKey, processPixel) => {
    var bmd = game.make.bitmapData();
    bmd.load(srcKey);
    bmd.processPixelRGB(processPixel);
    return bmd;
};

const grayscale = pixel => {
    const gray = (pixel.r + pixel.g + pixel.b) / 3; //average
    //const gray = (pixel.r * 0.2126  + pixel.g * 0.7152 + pixel.b * 0.0722); //luma
    //const gray = (Math.max(pixel.r,pixel.g,pixel.b) + Math.min(pixel.r,pixel.g,pixel.b))/2;//desaturate
    pixel.r = gray;
    pixel.g = gray;
    pixel.b = gray;

    return pixel;
};

export { createModifiedSpritesheet, buildPixelModificationFunction, grayscale };
