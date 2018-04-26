import { Item } from "./item";
import { items } from "../../enums/items";
import { animations } from "../../enums/animations";
import { now, animationDuration } from "../util";

import { sortBy } from "ramda";
import { deaths } from "../../enums/deaths";

const PROJECTILE_FIRE_DELAY = 100;
const FIRE_DELAY = 400;

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

        this.fireAfter = now() + PROJECTILE_FIRE_DELAY;

        player.state.inputInterrupt = now() + FIRE_DELAY;

        player.vx = 0;
    }

    update(player, gameManager) {
        super.update(player);

        if (typeof this.fireAfter === "number" && this.fireAfter < now()) {
            this.fireAfter = null;

            if (!this.canFire(player)) {
                return;
            }

            this.fireShot(player, gameManager);

            super.fire(player);
        }
    }

    fireShot(player, gameManager) {
        // TODO: Actually shoot
        const hitPlayers = gameManager.players.filter(p => {
            const isAlive = p.state.alive;
            const isFacing = player.flippedh ? player.x > p.x : player.x < p.x;

            const inVerticalPlane = player.y >= p.top && player.y <= p.bottom;

            return isAlive && isFacing && inVerticalPlane;
        });

        if (hitPlayers.length === 0) {
            return;
        }

        const dist = p => Math.abs(p.x - player.x);

        const hitPlayer = sortBy(dist, hitPlayers)[0];

        gameManager.killPlayer(hitPlayer, deaths.GUN, player);
    }
}
