export class Item {
    constructor(player) {
        this.pawn = player;
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
        this.pawn.weaponDestroyed();
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
            this.weaponFireAction();
            if (this.firing) {
                // this gives weaponFireAction in child classes a chance to override the animation playing
                this.handleMovementAndAmmo();
            }
        }
    }

    stopFiring() {}

    update() {
        if (this.heldFire && this.firing) {
            this.weaponFireAction();
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
            //negative 1 means unlimited ammo
            this.ammo--;
        }

        if (this.ammo === 0) {
            this.destroy();
        }
    }
}
