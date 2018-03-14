import { Item } from "./item";
import { items } from "../../enums/items";

export class ItemVolts extends Item {
    constructor(player) {
        super(items.VOLTS);

        this.canFireStanding = false;
        this.canFireCrouching = false;

        this.ammo = -1;

        // TODO: Player.sprite
    }

    destroy(player) {
        super.destroy(player);
    }
}
