import { Item } from "./item";
import { items } from "../../enums/items";
import { animations } from "../../enums/animations";
import { itemConfig, playerConfig } from "../config";

export class ItemChute extends Item {
    constructor(player) {
        super(items.CHUTE);

        this.canFireInAir = true;
        this.hasOpened = false;

        this.ammo = -1;
    }

    destroy(player) {
        super.destroy(player);
    }

    fire(player, itemManager) {
        if (!this.canFire(player)) {
            return;
        }

        if (this.hasOpened) {
            return;
        }

        this.hasOpened = true;

        super.fire(player);
    }

    stopFiring(player) {
        super.stopFiring(player);

        player.requestAnimationUpdate();
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

        if (player.state.grounded) {
            this.hasOpened = false;
        }
    }
}
