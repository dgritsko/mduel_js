import { setBounds } from "../util";
import { itemConfig } from "../config";
import { SpriteObject } from "../spriteObject";

export class Item extends SpriteObject {
    constructor(x, y, id) {
        super();

        this.id = id;
        this.setupSprite(x, y);
    }

    setupSprite(x, y) {
        const sprite = game.add.sprite(x, y, "powerups");

        sprite.animations.add("default", [0, 1, 2], 4, true);

        sprite.animations.play("default");

        sprite.anchor.setTo(0.5);

        const icon = game.add.sprite(0, 0, "powerups");
        icon.frame = this.id + 3;
        icon.anchor.setTo(0.5);
        sprite.addChild(icon);

        game.physics.enable(sprite);

        sprite.body.allowGravity = false;
        icon.body.allowGravity = false;

        sprite.body.collideWorldBounds = true;
        sprite.body.bounce.setTo(1, 1);

        setBounds(sprite, itemConfig.ITEM_BOUNDS);

        this.sprite = sprite;
    }
}
