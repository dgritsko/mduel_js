import { SpriteObject } from "../spriteObject";
import { playerConfig } from "../config";
import { setBounds } from "../util";
import { items } from "../../enums/items";

export class ProjectilePuck extends SpriteObject {
    constructor() {
        super();

        this.type = items.PUCK;

        this.sprite = game.add.sprite(0, 0, "items", 24);

        this.sprite.anchor.setTo(0.5);

        this.sprite.animations.add("default", [24, 25], 4, true);

        this.sprite.animations.play("default");

        game.physics.enable(this.sprite);

        setBounds(this.sprite, { top: 8, bottom: 0, left: -4, right: 8 });

        this.vx = playerConfig.RUN_SPEED * 2;
    }
}
