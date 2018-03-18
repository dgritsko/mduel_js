import { SpriteObject } from "../spriteObject";
import { items } from "../../enums/items";

export class ProjectileMine extends SpriteObject {
    constructor() {
        super();

        this.type = items.MINE;
    }
}
