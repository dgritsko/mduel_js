import { Item } from "./item";
import { items } from "../../enums/items";
import { animations } from "../../enums/animations";
import { itemConfig, playerConfig } from "../config";

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

        super.fire(player);
    }

    update(player) {
        if (this.firing) {
            if (!player.state.grounded) {
                if (player.vy > 0) {
                    player.vy = Math.min(
                        playerConfig.PARACHUTE_TERMINAL_VELOCITY,
                        player.vy
                    );
                    player.animation = animations.PARACHUTE;
                }
            } else {
                this.stopFiring(player);
            }
        }
    }
}
