import { Item } from "./item";
import { items } from "../../enums/items";

export class ItemGun extends Item {
    constructor(player) {
        super(items.GUN);

        this.canFireStanding = false;
        this.canFireCrouching = false;
        this.ammo = 0;
    }

    destroy(player) {
        super.destroy(player);
    }
}
