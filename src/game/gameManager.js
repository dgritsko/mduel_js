import { effects } from "../enums/effects";
import { deaths } from "../enums/deaths";
import { playerConfig } from "./config";

import { handlePlatformCollisions } from "../game/update/platformCollisions";
import { handlePlayerCollisions } from "../game/update/playerCollisions";
import { handleRopeCollisions } from "../game/update/ropeCollisions";
import { handlePickupItemCollisions } from "../game/update/pickupItemCollisions";
import { exceptIndex, playEffect } from "../game/util";

export class GameManager {
    constructor(level, players) {
        this.level = level;
        this.players = players;
    }

    update(itemManager) {
        this.players.forEach((player, index) => {
            if (!player.state.alive) {
                return;
            }

            player.update(itemManager, this);

            if (!player.state.climbingRope) {
                handlePlatformCollisions(player, this.level);
            } else {
                player.state.grounded = false;
            }

            handleRopeCollisions(player, this.level);

            player.handleInput(itemManager, this);

            const otherPlayers = exceptIndex(this.players, index);
            handlePlayerCollisions(player, otherPlayers, this);

            handlePickupItemCollisions(player, this.level, itemManager, this);
        });
    }

    killPlayer(player, deathType) {
        console.log(`Player ${player.id} died with death type ${deathType}`);

        player.state.alive = false;

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

        const activeTeammates = this.players.filter(
            p => p.state.alive && p.teamId === player.teamId
        );

        if (activeTeammates.length === 0) {
            this.endRound();
        }
    }

    endRound() {
        // Once only one team has living members,
        // all of those players should have their input disabled.
        // Next, check every update to see whether all have stopped moving.
        // Some players might have been in the air, and we need to account for
        // them to finish their animations, etc. Once this happens, we
        // can trigger the victory animations, kill all remaining items on the
        // screen, and finally end the round.

        console.log(
            "round should end as long as all other players have stopped"
        );
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
        for (let j = 0; j < this.players.length; j++) {
            const player = this.players[j];

            if (!player.state.alive) {
                continue;
            }

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
