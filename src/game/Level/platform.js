import { platformTypes } from "../../enums/platformTypes";

const makePlatform = (x, y, type) => {
    const frame = type === platformTypes.DEFAULT ? 0 : 1;

    const sprite = game.add.sprite(x, y, "platform", frame);

    game.physics.enable(sprite);

    sprite.body.moves = false;
    sprite.body.immovable = true;

    sprite.body.setSize(16, 8, 6, 0);

    return sprite;
};

export { makePlatform };
