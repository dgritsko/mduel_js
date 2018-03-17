import { SpriteObject } from "../spriteObject";
import { playerConfig } from "../config";

export class ProjectilePuck extends SpriteObject {
    constructor() {
        super();

        this.sprite = game.add.sprite(0, 0, "items", 24);

        this.sprite.anchor.setTo(0.5);

        this.sprite.animations.add("default", [24, 25], 4, true);

        this.sprite.animations.play("default");

        game.physics.enable(this.sprite);

        this.vx = playerConfig.RUN_SPEED * 2;
    }
}
