export class Item {
    constructor(player, type) {
        this.pawn = player;
        this.type = type;
        this.canFireStanding = false;
        this.canFireInAir = false;
        this.canFireCrouching = false;
        this.canMoveWhileFiring = false;
        this.ammo = -1;
        this.heldFire = false;
        this.firing = false;
        this.wasFiring = false;
    }

    destroy() {
        this.stopFiring();
        this.pawn.itemDestroyed();
    }

    fire() {
        if (this.pawn.state.isOnRope) {
            return false;
        }

        if (this.pawn.state.grounded && this.pawn.state.crouching) {
            this.firing = this.canFireCrouching;
        } else if (this.pawn.state.grounded) {
            this.firing = this.canFireStanding;
        } else {
            this.firing = this.canFireInAir;
        }

        if (this.firing && !this.heldFire) {
            this.itemFireAction();
            if (this.firing) {
                // this gives itemFireAction in child classes a chance to override the animation playing
                this.handleMovementAndAmmo();
            }
        }
    }

    stopFiring() {
        this.firing = false;
    }

    update() {
        if (this.heldFire && this.firing) {
            this.itemFireAction();
            this.handleMovementAndAmmo();
        }

        this.wasFiring = this.firing;
    }

    handleMovementAndAmmo() {
        if (!this.canMoveWhileFiring) {
            this.pawn.vx = 0;
        }

        // TODO
        // if (firingAnim.size() > 0 && !this.heldFire) {
        //     // pawn->setArbitraryAnim(firingAnim, false, fireAnimSpeed);
        //     // pawn->setInputInterrupt(fireAnimSpeed * firingAnim.size());
        // }

        if (this.ammo !== -1) {
            // negative 1 means unlimited ammo
            this.ammo--;
        }

        if (this.ammo === 0) {
            this.destroy();
        }
    }
}
