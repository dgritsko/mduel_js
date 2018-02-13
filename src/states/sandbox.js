import { now } from "../game/util";
import cfg from "../game/config";
import { Player } from "../game/player";
import { range } from "ramda";
import ItemManager from "../game/itemManager";

let player1;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    let manager = new ItemManager();
}

function update() {}

export default { create: create, update: update };
