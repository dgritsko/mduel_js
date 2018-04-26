import { Item } from "./item";
import { items } from "../../enums/items";
import { ProjectileMine } from "./projectileMine";
import { animations } from "../../enums/animations";
import { now } from "../util";

const PLANT_DELAY = 100;

export class ItemMine extends Item {
    constructor(player) {
        super(items.MINE);

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

        if (this.fireAfter > now()) {
            return;
        }

        player.animation = animations.MINE_PLANT;

        this.fireAfter = now() + PLANT_DELAY;
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
        const offset = 10;

        const mine = new ProjectileMine();
        mine.x = player.flippedh ? player.left - offset : player.right + offset;
        mine.y = player.bottom - offset;

        itemManager.addProjectile(mine);
    }
}
