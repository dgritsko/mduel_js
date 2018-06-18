import { platformTypes } from "../../enums/platformTypes";
import { setBounds } from "../util";
import { gameConfig } from "../config";

const makePlatform = (x, y, type) => {
    const frame = type === platformTypes.DEFAULT ? 0 : 1;

    const sprite = game.add.sprite(x, y, "platform", frame);

    sprite.anchor.setTo(0.5);

    game.physics.enable(sprite);

    sprite.body.moves = false;
    sprite.body.immovable = true;

    setBounds(sprite, gameConfig.PLATFORM_BOUNDS)

    return sprite;
};

export { makePlatform };
