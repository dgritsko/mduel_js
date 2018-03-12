export class Item {
    constructor(type) {
        this.type = type;

        this.firing = false;
    }

    canFire(player) {}

    didFire(player) {}

    fire(player) {}

    stopFiring(player) {}

    destroy(player) {}

    update(player) {}
}
