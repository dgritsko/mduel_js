import { SpriteObject } from "../spriteObject";
import { playerConfig } from "../config";
import { setBounds } from "../util";
import { items } from "../../enums/items";

export class ProjectileGrenade extends SpriteObject {
    constructor() {
        super();

        this.type = items.GRENADE;

        this.sprite = game.add.sprite(0, 0, "items", 26);

        this.sprite.animations.add("default", [26, 27], 4, true);

        this.sprite.animations.play("default");

        game.physics.enable(this.sprite);

        setBounds(this.sprite, { top: 2, right: 2, bottom: 5, left: -1 });

        this.vy = -playerConfig.JUMP_IMPULSE;
        this.vx = playerConfig.RUN_SPEED;
    }
}
