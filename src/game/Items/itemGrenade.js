import { Item } from "./item";
import { items } from "../../enums/items";
import { ProjectileGrenade } from "./projectileGrenade";

export class ItemGrenade extends Item {
    constructor(player) {
        super(items.GRENADE);

        this.canFireStanding = true;
        this.canFireCrouching = false;
        this.ammo = -1;
    }

    destroy(player) {
        super.destroy(player);
    }

    fire(player, itemManager) {
        if (!this.canFire(player)) {
            return;
        }

        const grenade = new ProjectileGrenade();
        grenade.x = player.x;
        grenade.y = player.y;

        grenade.vx = grenade.vx * (player.flippedh ? -1 : 1);

        itemManager.addProjectile(grenade);
    }
}
