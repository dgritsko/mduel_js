import { now } from "../game/util";
import cfg from "../game/config";
import { Player } from "../game/player";
import { range } from "ramda";

let player1;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    const allPowerups = [];

    range(0, 12).map(i => {
        const powerup = game.add.sprite(
            100 + i * 34,
            game.world.centerY,
            "powerups"
        );

        powerup.animations.add("default", [0, 1, 2], 4, true);
        //powerup.animations.add("default", [0], 2, true);
        powerup.animations.play("default");

        powerup.anchor.setTo(0.5);

        const icon = game.add.sprite(0, 0, "powerups");
        icon.frame = i + 3;
        icon.anchor.setTo(0.5);
        powerup.addChild(icon);

        game.physics.enable(powerup);

        allPowerups.push(powerup);

        powerup.body.velocity.x = (Math.random() - 0.5) * 100;
        powerup.body.velocity.y = (Math.random() - 0.5) * 100;
        powerup.body.collideWorldBounds = true;
        powerup.body.bounce.setTo(1, 1);
    });
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

function update() {}

export default { create: create, update: update };
