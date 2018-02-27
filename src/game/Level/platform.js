import { platform_types } from "../../enums/platform_types";

const makePlatform = (x, y, type) => {
    const spriteName =
        type === platform_types.DEFAULT ? "main_platform" : "spawn_platform";

    const sprite = game.add.sprite(x, y, spriteName);

    game.physics.enable(sprite);

    sprite.body.moves = false;
    sprite.body.immovable = true;

    sprite.body.setSize(16, 8, 6, 0);

    return sprite;
};

export { makePlatform };
