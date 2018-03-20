import { Item } from "./item";
import { items } from "../../enums/items";

export class ItemChute extends Item {
    constructor(player) {
        super(items.CHUTE);

        this.canFireStanding = false;
        this.canFireCrouching = false;
        this.canFireInAir = true;

        this.ammo = -1;
    }

    destroy(player) {
        super.destroy(player);
    }

    fire(player, itemManager) {
        if (!this.canFire(player)) {
            return;
        }
    }

    update(player) {
    }
}
