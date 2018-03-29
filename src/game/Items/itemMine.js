import { Item } from "./item";
import { items } from "../../enums/items";
import { ProjectileMine } from "./projectileMine";
import { animations } from "../../enums/animations";

export class ItemMine extends Item {
    constructor(player) {
        super(items.MINE);

        this.canFireStanding = true;
        this.canFireCrouching = false;
        this.ammo = 1;
    }

    destroy(player) {
        super.destroy(player);
    }

    fire(player, itemManager) {
        if (!this.canFire(player)) {
            return;
        }

        super.fire(player);

        const mine = new ProjectileMine();
        mine.x = player.x;
        mine.y = player.y;

        itemManager.addProjectile(mine);

        player.animation = animations.MINE_PLANT;
    }
}
