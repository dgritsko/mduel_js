import { Item } from "./item";
import { items } from "../../enums/items";

export class ItemInvisibility extends Item {
    constructor() {
        super(items.INVISIBILITY);

        this.canFireStanding = true;

        this.ammo = 1;
    }

    fire(player) {
        if (!this.canFire(player)) {
            return;
        }

        if (player.sprite.alpha) {
            player.sprite.alpha = 0.0;
        } else {
            this.destroy(player);
        }
    }

    destroy(player) {
        super.destroy(player);

        player.sprite.alpha = 1.0;
    }
}
