import { Item } from "./item";
import { items } from "../../enums/items";
import { ProjectilePuck } from "./projectilePuck";
import { animations } from "../../enums/animations";
import { now } from "../util";

// TODO: Move these constants somewhere?
const PROJECT_X_OFFSET = 4;
const PROJECT_Y_OFFSET = 16;
const PROJECTILE_FIRE_DELAY = 100;

export class ItemPuck extends Item {
    constructor(player) {
        super();

        this.type = items.PUCK;

        this.canFireStanding = true;

        // TODO: Change this to 1 once development is complete
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
            return;
        }

        player.animation = animations.PUCK_TOSS;

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
        const puck = new ProjectilePuck();

        const x = player.flippedh
            ? player.left - PROJECT_X_OFFSET
            : player.right + PROJECT_X_OFFSET;
        const y = player.bottom - PROJECT_Y_OFFSET;

        puck.x = x;
        puck.y = y;
        puck.vx = puck.vx * (player.flippedh ? -1 : 1);

        itemManager.addProjectile(puck);
    }
}
