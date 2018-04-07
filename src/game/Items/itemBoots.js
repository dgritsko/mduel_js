import { Item } from "./item";
import { items } from "../../enums/items";

export class ItemBoots extends Item {
    constructor() {
        super(items.BOOTS);

        this.canFireStanding = true;

        this.ammo = -1;
    }

    fire(player) {
        if (!this.canFire(player)) {
            return;
        }

        player.jump(true);
    }

    destroy(player) {
        super.destroy(player);
    }
}
