import { Item } from "./item";
import { items } from "../../enums/items";

export class ItemWarp extends Item {
    constructor() {
        super(items.WARP);

        this.ammo = 1;
        this.autoFire = true;
    }

    itemFireAction(player) {
        const x = Math.random() * game.world.width;
        const y = Math.random() * game.world.height * 0.57;
        player.x = x;
        player.y = y;
        this.ammo = 0;
    }
}
