import { Item } from "./item";
import { items } from "../../enums/items";
import { ProjectilePuck } from "./projectilePuck";

export class ItemPuck extends Item {
    constructor(player) {
        super(items.PUCK);

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

        const puck = new ProjectilePuck();
        puck.x = player.x;
        puck.y = player.y;

        itemManager.addProjectile(puck);
    }
}
