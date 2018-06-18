import { SpriteObject } from "../spriteObject";
import { gameConfig } from "../config";
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

        setBounds(this.sprite, gameConfig.ITEM_GRENADE_PROJECT_BOUNDS);

        this.vy = -gameConfig.PLAYER_JUMP_IMPULSE;
        this.vx = gameConfig.PLAYER_RUN_SPEED;
    }
}
