import { Item } from "./item";
import { items } from "../../enums/items";
import { now } from "../util";

const INTERVAL = 100;
const NUM_VARIATIONS = 7;

export class ItemVolts extends Item {
    constructor(player) {
        super(items.VOLTS);

        this.ammo = -1;

        this.skin = game.add.sprite(0, 0, `${player.sprite.key}_volts`);

        this.skin.anchor.setTo(0.5);

        player.sprite.addChild(this.skin);

        this.nextTick = now();

        this.offset = 0;
    }

    destroy(player) {
        super.destroy(player);

        player.sprite.removeChild(this.skin);

        this.skin.destroy();
    }

    update(player) {
        if (this.nextTick < now()) {
            this.nextTick = now() + INTERVAL;
            this.offset += 1;
        }

        this.skin.frame =
            player.sprite.frame * NUM_VARIATIONS + this.offset % NUM_VARIATIONS;
    }
}
