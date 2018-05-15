import { Item } from "./item";
import { items } from "../../enums/items";
import { ProjectilePuck } from "./projectilePuck";
import { animations } from "../../enums/animations";
import { now } from "../util";

// TODO: Move these constants somewhere?
const PROJECT_X_OFFSET = 8;
const PROJECT_Y_OFFSET = 16;
const PROJECTILE_FIRE_DELAY = 100;
const FIRE_DELAY = 400;

export class ItemPuck extends Item {
    constructor(player) {
        super(items.PUCK);

        this.canFireStanding = true;

        this.ammo = 1;
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

        player.state.inputInterrupt = now() + FIRE_DELAY;
    }

    update(player, gameManager) {
        super.update(player);

        if (typeof this.fireAfter === "number" && this.fireAfter < now()) {
            this.fireAfter = null;

            if (!this.canFire(player)) {
                return;
            }

            this.createProjectile(player, gameManager.itemManager);

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
