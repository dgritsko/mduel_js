import { playEffect } from "./util";
import { effects } from "../enums/effects";

export class GameManager {
    constructor(level, players) {
        this.level = level;
        this.players = players;
    }

    killPlayer(player, deathType) {
        console.log(`Player ${player.id} died with death type ${deathType}`);
    }

    warpPlayer(player) {
        const x = Math.random() * game.world.width;
        const y = Math.random() * game.world.height * 0.57;
        player.x = x;
        player.y = y;

        playEffect(effects.GREEN_PUFF, x, y);
    }
}
