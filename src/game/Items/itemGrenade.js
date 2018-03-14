import { Item } from "./item";
import { items } from "../../enums/items";

export class ItemGrenade extends Item {
    constructor(player) {
        super(items.GRENADE);

        this.canFireStanding = false;
        this.canFireCrouching = false;
        this.ammo = 0;
    }

    destroy(player) {
        super.destroy(player);
    }
}
