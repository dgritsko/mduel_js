import cfg from "../game/config";

class ItemManager {
    constructor() {
        for (var i = 0; i < 120; i++) {
            const p = new Powerup(100, 100, i % 12);
            const vel = this.getRightVelocity();
            p.sprite.body.velocity.x = vel.x;
            p.sprite.body.velocity.y = vel.y;
        }
    }

    getTopVelocity() {
        let θ = Math.random() * Math.PI;
        return this.getVelocity(θ);
    }

    getLeftVelocity() {
        let θ = (Math.random() - 0.5) * Math.PI;
        return this.getVelocity(θ);
    }

    getRightVelocity() {
        let θ = (Math.random() + 0.5) * -Math.PI;
        return this.getVelocity(θ);
    }

    getVelocity(θ) {
        const v = cfg.powerupSpeed;
        return { x: Math.cos(θ) * v, y: Math.sin(θ) * v };
    }
}

class Powerup {
    constructor(x, y, id) {
        this.id = id;
        this.setupSprite(x, y);
    }

    setupSprite(x, y) {
        const powerup = game.add.sprite(x, y, "powerups");

        powerup.animations.add("default", [0, 1, 2], 4, true);
        //powerup.animations.add("default", [0], 2, true);
        powerup.animations.play("default");

        powerup.anchor.setTo(0.5);

        const icon = game.add.sprite(0, 0, "powerups");
        icon.frame = this.id + 3;
        icon.anchor.setTo(0.5);
        powerup.addChild(icon);

        game.physics.enable(powerup);

        powerup.body.collideWorldBounds = true;
        powerup.body.bounce.setTo(1, 1);

        this.sprite = powerup;
    }
}

const powerups = {
    DEATH: 0,
    VOLTS: 1,
    INVISIBILITY: 2,
    MINE: 3,
    GUN: 4,
    TNT: 5,
    BOOTS: 6,
    GRENADE: 7,
    PUCK: 8,
    CHUTE: 9,
    HOOK: 10,
    WARP: 11
};

export default ItemManager;
