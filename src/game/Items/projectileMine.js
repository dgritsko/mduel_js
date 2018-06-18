import { SpriteObject } from "../spriteObject";
import { items } from "../../enums/items";
import { setBounds } from "../util";
import { gameConfig } from "../config";

export class ProjectileMine extends SpriteObject {
    constructor() {
        super();

        this.type = items.MINE;

        this.sprite = game.add.sprite(0, 0, "items", 14);

        this.sprite.anchor.setTo(0.5);

        game.physics.enable(this.sprite);

        setBounds(this.sprite, gameConfig.ITEM_MINE_PROJECT_BOUNDS)
    }
}
