import { Item } from "./item";
import { items } from "../../enums/items";
import { ProjectileMine } from "./projectileMine";

export class ItemMine extends Item {
    constructor(player) {
        super(items.MINE);

        this.canFireStanding = false;
        this.canFireCrouching = false;
        this.ammo = 0;
    }

    destroy(player) {
        super.destroy(player);
    }

    fire(player, itemManager) {
        if (!this.canFire(player)) {
            return;
        }

        const mine = new ProjectileMine();
        mine.x = player.x;
        mine.y = player.y;
    }
}
