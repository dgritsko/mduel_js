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
    var gray = (pixel.r + pixel.g + pixel.b) / 3; //average
    //var gray = (pixel.r * 0.2126  + pixel.g * 0.7152 + pixel.b * 0.0722); //luma
    //var gray = (Math.max(pixel.r,pixel.g,pixel.b) + Math.min(pixel.r,pixel.g,pixel.b))/2;//desaturate
    pixel.r = gray;
    pixel.g = gray;
    pixel.b = gray;

    return pixel;
};

export { createModifiedSpritesheet, grayscale };
