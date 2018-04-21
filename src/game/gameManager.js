import { playEffect } from "./util";
import { effects } from "../enums/effects";
import { deaths } from "../enums/deaths";
import { playerConfig } from "./config";

export class GameManager {
    constructor(level, players) {
        this.level = level;
        this.activePlayers = players;
    }

    killPlayer(player, deathType) {
        console.log(`Player ${player.id} died with death type ${deathType}`);

        this.activePlayers = this.activePlayers.filter(p => p !== player);

        switch (deathType) {
            case deaths.MINE:
                break;
            case deaths.PUCK:
                player.allowGravity = false;
                player.vx = 0;
                // TODO: Constant
                player.vy = -playerConfig.POWERHIT_SPEED;
                player.playDisintegrated();
                break;
        }

        const activeTeammates = this.activePlayers.filter(
            p => p.teamId === player.teamId
        );

        if (activeTeammates.length === 0) {
            console.log(
                "round should end as long as all other players have stopped"
            );
        }
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

    collideWithPlayer(sprite) {
        for (let j = 0; j < this.activePlayers.length; j++) {
            const player = this.activePlayers[j];

            const hitPlayer = game.physics.arcade.overlap(
                sprite,
                player.sprite
            );

            if (hitPlayer) {
                return player;
            }
        }

        return false;
    }
}
