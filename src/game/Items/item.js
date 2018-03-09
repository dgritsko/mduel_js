export class Item {
    constructor(type) {
        this.type = type;

        this.autoFire = false;
        this.firing = false;
    }

    destroy(player) {
        console.log(`destroy called for player ${player.id}`);
    }

    fire(player) {
        console.log(`fire called for player ${player.id}`);

        if (this.autoFire) {
            this.firing = true;
        }

        if (this.firing) {
            this.itemFireAction(player);
        }

        if (this.ammo === 0) {
            player.clearItem();
        }
    }

    stopFiring(player) {
        this.firing = false;
    }

    update(player) {
        if ((this.heldFire && this.firing) || this.autoFire) {
            this.fire(player);
        }
    }
}
