import { Item } from "./item";
import { items } from "../../enums/items";

export class ItemPuck extends Item {
    constructor(player) {
        super(items.PUCK);

        this.canFireStanding = false;
        this.canFireCrouching = false;
        this.ammo = 0;
    }

    destroy(player) {
        super.destroy(player);
    }
}
