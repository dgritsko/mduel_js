import { Item } from "./item";
import { items } from "../../enums/items";
import { now } from "../util";

export class ItemVolts extends Item {
    constructor(player) {
        super(items.VOLTS);

        this.ammo = -1;

        // TODO: Figure out what sprite to use
        this.skin = game.add.sprite(0, 0, "player1_1000v");

        this.skin.anchor.setTo(0.5);

        // TODO: Scale up the graphics instead of setting scale
        this.skin.scale.setTo(2);

        player.sprite.addChild(this.skin);

        this.tick = true;

        this.nextTick = now();
    }

    destroy(player) {
        super.destroy(player);

        player.sprite.removeChild(this.skin);

        this.skin.destroy();
    }

    update(player) {
        if (this.nextTick < now()) {
            this.tick = !this.tick;
            this.nextTick = now() + 20;
        }

        this.skin.frame = player.sprite.frame;

        this.skin.visible = this.tick;
    }
}
