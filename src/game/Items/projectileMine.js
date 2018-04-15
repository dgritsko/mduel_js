import { SpriteObject } from "../spriteObject";
import { items } from "../../enums/items";
import { setBounds } from "../util";

export class ProjectileMine extends SpriteObject {
    constructor() {
        super();

        this.type = items.MINE;

        this.sprite = game.add.sprite(0, 0, "items", 14);

        this.sprite.anchor.setTo(0.5);

        game.physics.enable(this.sprite);

        setBounds(this.sprite, { top: -5, bottom: 5, left: -5, right: 5 })
    }
}
