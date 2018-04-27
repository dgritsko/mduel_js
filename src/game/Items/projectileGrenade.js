import { SpriteObject } from "../spriteObject";
import { playerConfig } from "../config";
import { setBounds } from "../util";
import { items } from "../../enums/items";

export class ProjectileGrenade extends SpriteObject {
    constructor() {
        super();

        this.type = items.GRENADE;

        this.sprite = game.add.sprite(0, 0, "items", 26);

        this.sprite.anchor.setTo(0.5);

        this.sprite.animations.add("default", [26, 27], 4, true);

        this.sprite.animations.play("default");

        game.physics.enable(this.sprite);

        setBounds(this.sprite, { top: 3, right: 7, bottom: 12, left: -3 });

        this.vy = -playerConfig.JUMP_IMPULSE;
        this.vx = playerConfig.RUN_SPEED;
    }
}
