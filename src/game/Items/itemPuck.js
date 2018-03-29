import { Item } from "./item";
import { items } from "../../enums/items";
import { ProjectilePuck } from "./projectilePuck";
import { animations } from "../../enums/animations";

export class ItemPuck extends Item {
    constructor(player) {
        super();

        this.type = items.PUCK;

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
        puck.vx = puck.vx * (player.flippedh ? -1 : 1);

        itemManager.addProjectile(puck);

        player.animation = animations.PUCK_TOSS;
    }
}
