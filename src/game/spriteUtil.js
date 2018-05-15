import { all, sortBy } from "ramda";

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

const stringifyColor = color => {
    const r = ("00" + color.r.toString(16)).substr(-2);
    const g = ("00" + color.g.toString(16)).substr(-2);
    const b = ("00" + color.b.toString(16)).substr(-2);
    return `#${r}${g}${b}`;
};

const expandStr = str => {
    return expandObj(parseColor(str));
};

const expandArray = arr => {
    const matches = arr.map(expandMatch);

    return (p, x, y) => all(m => m(p, x, y), matches);
};

const expandMatch = match => {
    if (Array.isArray(match)) {
        return expandArray(match);
    }

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

    return (px, x, y) => {
        expanded.forEach(element => {
            if (element.match(px, x, y)) {
                element.apply(px);
            }
        });
        return px;
    };
};

const getSpritesheetInfo = spriteName => {
    const firstFrame = game.cache.getFrameData(spriteName).getFrame(0);
    const frameCount = game.cache.getFrameCount(spriteName);

    const frameWidth = firstFrame.width;
    const frameHeight = firstFrame.height;
    return { frameWidth, frameHeight, frameCount };
};

const createModifiedSpritesheet = (spriteName, newSpriteName, processPixel) => {
    const { frameWidth, frameHeight, frameCount } = getSpritesheetInfo(
        spriteName
    );

    const modifiedBitmap = makeBitmap(spriteName, processPixel);

    game.cache.addSpriteSheet(
        newSpriteName,
        null,
        modifiedBitmap.canvas,
        frameWidth,
        frameHeight,
        frameCount
    );
};

const makeBitmap = (srcKey, processPixel) => {
    const bmd = game.make.bitmapData();
    bmd.load(srcKey);
    bmd.processPixelRGB(processPixel);
    return bmd;
};

const analyzeSprite = srcKey => {
    const stats = {};

    const bmd = game.make.bitmapData();
    bmd.load(srcKey);
    bmd.processPixelRGB((pixel, x, y) => {
        if (!pixel.a) {
            return;
        }

        const key = stringifyColor(pixel);

        if (!stats[key]) {
            stats[key] = 0;
        }
        stats[key]++;
    });

    const statList = Object.keys(stats).map(key => {
        return { color: key, count: stats[key] };
    });

    const sorted = sortBy(x => -x.count, statList);

    return sorted;
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

const combineSpriteSheets = (spriteNames, newSpriteName, horizontal) => {
    const bitmapDatas = spriteNames.map(spriteName => {
        const bmd = game.make.bitmapData();
        bmd.load(spriteName);
        return bmd;
    });

    const widths = new Set(bitmapDatas.map(x => x.width));
    const heights = new Set(bitmapDatas.map(x => x.height));

    if (widths.size !== 1 || heights.size !== 1) {
        console.error(
            "Sprites must all be same dimensions in order to be combined"
        );
        return;
    }

    const width = widths.values().next().value;
    const height = heights.values().next().value;

    const destWidth = horizontal ? width * spriteNames.length : width;
    const destHeight = horizontal ? height : height * spriteNames.length;
    const destBmd = game.make.bitmapData(destWidth, destHeight);

    bitmapDatas.forEach((bitmapData, i) => {
        const destX = horizontal ? width * i : 0;
        const destY = horizontal ? 0 : height * i;

        destBmd.copyRect(
            bitmapData,
            new Phaser.Rectangle(0, 0, width, height),
            destX,
            destY
        );
    });

    const { frameWidth, frameHeight, frameCount } = getSpritesheetInfo(
        spriteNames[0]
    );

    game.cache.addSpriteSheet(
        newSpriteName,
        null,
        destBmd.canvas,
        frameWidth,
        frameHeight,
        frameCount * spriteNames.length
    );
};

const setupVoltsSprite = spriteName => {
    const stats = analyzeSprite("player1");

    const primaryColor = stats[0].color;
    const secondaryColor = stats[1].color;
    const tertiaryColor = stats[2].color;
    const quaternaryColor = stats[3].color;
    const quinaryColor = stats[4].color;

    const firstQuartile = (p, x, y) => y % 64 < 16;
    const secondQuartile = (p, x, y) => y % 64 >= 16 && y % 64 < 32;
    const thirdQuartile = (p, x, y) => y % 64 >= 32 && y % 64 < 48;
    const fourthQuartile = (p, x, y) => y % 64 >= 48;

    const ruleSets = [
        [{ match: [primaryColor, firstQuartile], apply: "0000ff" }],
        [{ match: secondaryColor, apply: "0000ff" }],
        [{ match: tertiaryColor, apply: "#0000ff" }],
        [{ match: quaternaryColor, apply: "#0000ff" }],
        [{ match: quinaryColor, apply: "#0000ff" }]
    ];

    const getTempSpriteName = i => `${spriteName}_volts_temp_${i}`;

    ruleSets.forEach((rules, i) => {
        const fun = buildPixelModificationFunction(rules);

        const sprite = getTempSpriteName(i);

        createModifiedSpritesheet(spriteName, sprite, fun);
    });

    combineSpriteSheets(
        ruleSets.map((r, i) => getTempSpriteName(i)),
        `${spriteName}_volts`,
        true
    );

    game.add.sprite(0, 0, `${spriteName}_volts`, -1);
    // for (let j = 0; j < 1; j++) {
    //     game.add.sprite((i + 1) * 64, j * 64, sprite, -1);
    // }
};

export {
    createModifiedSpritesheet,
    combineSpriteSheets,
    buildPixelModificationFunction,
    analyzeSprite,
    setupVoltsSprite,
    grayscale
};
