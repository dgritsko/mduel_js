import { Item } from "./item";
import { items } from "../../enums/items";
import { playSound } from "../util";
import { sounds } from "../../enums/sounds";

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
            playSound(sounds.INVISIBILITY_ON);
            player.sprite.alpha = 0.0;
        } else {
            playSound(sounds.INVISIBILITY_OFF);
            this.destroy(player);
        }
    }

    destroy(player) {
        super.destroy(player);

        player.sprite.alpha = 1.0;
    }
}
