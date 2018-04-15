import { Item } from "./item";
import { items } from "../../enums/items";
import { ProjectileGrenade } from "./projectileGrenade";
import { animations } from "../../enums/animations";
import { now } from "../util";

// TODO: Move these constants somewhere?
const PROJECTILE_FIRE_DELAY = 100;

export class ItemGrenade extends Item {
    constructor(player) {
        super(items.GRENADE);

        this.canFireStanding = true;
        this.ammo = -1;
    }

    destroy(player) {
        super.destroy(player);
    }

    fire(player, itemManager) {
        if (!this.canFire(player)) {
            return;
        }

        if (this.fireAfter > now()) {
            // TODO: Also check for firing animation completion
            return;
        }

        player.animation = animations.GRENADE_TOSS;

        this.fireAfter = now() + PROJECTILE_FIRE_DELAY;
    }

    update(player, itemManager) {
        super.update(player);

        if (typeof this.fireAfter === "number" && this.fireAfter < now()) {
            this.fireAfter = null;

            if (!this.canFire(player)) {
                return;
            }

            this.createProjectile(player, itemManager);

            super.fire(player);
        }
    }

    createProjectile(player, itemManager) {
        const grenade = new ProjectileGrenade();
        grenade.x = player.flippedh ? player.right : player.left;

        grenade.y = player.top;

        grenade.vx = grenade.vx * (player.flippedh ? -1 : 1);

        itemManager.addProjectile(grenade);
    }
}