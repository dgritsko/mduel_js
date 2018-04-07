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

    collideWithPlatforms(sprite, destroyOnCollision) {
        const toRemove = [];

        if (destroyOnCollision) {
            game.physics.arcade.overlap(
                this.level.platforms,
                sprite,
                (item, platform) => {
                    toRemove.push(platform);
                }
            );

            // TODO: Remove adjacent platform as well
            toRemove.forEach(platform => {
                playEffect(effects.GRAY_PUFF, platform.x, platform.y);
                this.level.platforms.remove(platform);
                platform.destroy();
            });

            return toRemove.length > 0;
        } else {
            return game.physics.arcade.collide(
                sprite,
                this.level.platforms,
                () => {}
            );
        }
    }

    collideWithPlayers(sprite) {
        for (let j = 0; j < this.players.length; j++) {
            const player = this.players[j];

            const hitPlayer = game.physics.arcade.overlap(
                sprite,
                player.sprite
            );

            if (hitPlayer) {
                return true;
            }
        }

        return false;
    }
}
