import { Item } from "./item";
import { items } from "../../enums/items";
import { animations } from "../../enums/animations";
import { now } from "../util";

const FIRE_DELAY = 100;

export class ItemGun extends Item {
    constructor(player) {
        super(items.GUN);

        this.canFireStanding = true;
        this.ammo = 5;
    }

    destroy(player) {
        super.destroy(player);
    }

    fire(player) {
        if (!this.canFire(player)) {
            return;
        }

        if (this.fireAfter > now()) {
            return;
        }

        player.animation = animations.SHOOT;

        this.fireAfter = now() + FIRE_DELAY;
    }

    update(player, itemManager) {
        super.update(player);

        if (typeof this.fireAfter === "number" && this.fireAfter < now()) {
            this.fireAfter = null;

            if (!this.canFire(player)) {
                return;
            }

            this.fireShot(player, itemManager);

            super.fire(player);
        }
    }

    fireShot(player, itemManager) {
        // TODO: Actually shoot
    }
}
