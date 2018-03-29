export class Item {
    constructor(type) {
        this.type = type;

        this.canFireStanding = false;
        this.canFireCrouching = false;
        this.canFireInAir = false;
        this.canMoveWhileFiring = false;

        this.firing = false;
    }

    canFire(player) {
        if (player.state.grounded && !player.state.rolling) {
            if (player.state.crouching) {
                return this.canFireCrouching;
            }

            return this.canFireStanding;
        }

        if (!player.state.grounded) {
            return this.canFireInAir;
        }

        return false;
    }

    didFire(player) {}

    fire(player) {
        this.firing = true;

        if (this.ammo > 0) {
            this.ammo -= 1;
        }
    }

    stopFiring(player) {
        this.firing = false;
    }

    destroy(player) {
        player.state.currItem = null;
    }

    update(player) {
        if (this.ammo === 0) {
            this.destroy(player);
        }
    }
}
