import { Item } from "./item";
import { items } from "../../enums/items";

export class ItemWarp extends Item {
    constructor(player) {
        super(player, items.WARP);

        // TODO: Do we need all this crap? Probably not since the warp is triggered immediately?
        this.canFireStanding = true;
        this.canFireInAir = true;
        this.canFireCrouching = true;
        this.canMoveWhileFiring = true;
        this.ammo = 1;
        this.heldFire = false;

        this.itemFireAction();
    }

    itemFireAction() {
        const x = Math.random() * game.world.width;
        const y = Math.random() * game.world.height * 0.57;
        this.pawn.x = x;
        this.pawn.y = y;

        this.ammo = 0;
    }
}
