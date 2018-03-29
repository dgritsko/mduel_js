import { Item } from "./item";
import { items } from "../../enums/items";
import { animations } from "../../enums/animations";

export class ItemGun extends Item {
    constructor(player) {
        super(items.GUN);

        this.canFireStanding = true;
        this.canFireCrouching = false;
        this.ammo = 5;
    }

    destroy(player) {
        super.destroy(player);
    }

    fire(player) {
        if (!this.canFire(player)) {
            return;
        }

        super.fire(player);

        player.animation = animations.SHOOT;
    }
}
