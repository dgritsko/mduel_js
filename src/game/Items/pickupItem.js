import { setBounds } from "../util";
import { gameConfig } from "../config";
import { SpriteObject } from "../spriteObject";
import { now, randomBetween } from "../util";

export class PickupItem extends SpriteObject {
    constructor(x, y, type, itemManager) {
        super();

        this.type = type;
        this.setupSprite(x, y);

        this.sprite.data.type = type;

        // TODO: Move this elsewhere? Or refactor
        // activeItems to not be a group?
        const despawnDelay = randomBetween(
            itemManager.config.minItemLifetime,
            itemManager.config.maxItemLifetime
        );

        if (despawnDelay) {
            const despawnTime = now() + despawnDelay;
            this.sprite.data.despawnTime = despawnTime;
        }
    }

    setupSprite(x, y) {
        const sprite = game.add.sprite(x, y, "items");

        sprite.animations.add("default", [0, 1, 2], 4, true);

        sprite.animations.play("default");

        sprite.anchor.setTo(0.5);

        const icon = game.add.sprite(0, 0, "items");
        icon.frame = this.type + 3;
        icon.anchor.setTo(0.5);
        sprite.addChild(icon);

        game.physics.enable(sprite);

        sprite.body.allowGravity = false;
        icon.body.allowGravity = false;

        sprite.body.collideWorldBounds = true;
        sprite.body.bounce.setTo(1, 1);

        setBounds(sprite, gameConfig.ITEM_BOUNDS);

        this.sprite = sprite;
    }
}
