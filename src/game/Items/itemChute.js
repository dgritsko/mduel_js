import { Item } from "./item";
import { items } from "../../enums/items";

export class ItemChute extends Item {
    constructor(player) {
        super(items.CHUTE);

        this.canFireStanding = false;
        this.canFireCrouching = false;
        this.ammo = 0;
    }

    destroy(player) {
        super.destroy(player);
    }
}
