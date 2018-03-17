import { SpriteObject } from "../spriteObject";
import { playerConfig } from "../config";

export class ProjectileGrenade extends SpriteObject {
    constructor() {
        super();

        this.sprite = game.add.sprite(0, 0, "items", 26);

        this.sprite.animations.add("default", [26, 27], 4, true);

        this.sprite.animations.play("default");

        game.physics.enable(this.sprite);

        this.vy = -playerConfig.JUMP_IMPULSE;
        this.vx = playerConfig.RUN_SPEED;
    }
}
