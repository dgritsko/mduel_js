import { effects } from "../enums/effects";
import { deaths } from "../enums/deaths";
import { playerConfig } from "./config";

import { handlePlatformCollisions } from "../game/update/platformCollisions";
import { handlePlayerCollisions } from "../game/update/playerCollisions";
import { handleRopeCollisions } from "../game/update/ropeCollisions";
import { handlePickupItemCollisions } from "../game/update/pickupItemCollisions";
import { exceptIndex, playEffect } from "../game/util";
import { ItemManager } from "../game/Items/itemManager";

const phasesEnum = {
    DEFAULT: 0,
    VICTORY_REQUIRED: 1,
    ENDING_REQUIRED: 2,
    ENDING: 3
};

export class GameManager {
    constructor(level, players) {
        this.level = level;
        this.players = players;
        this.itemManager = new ItemManager(level);
        this.phase = phasesEnum.DEFAULT;
    }

    update() {
        if (this.phase === phasesEnum.VICTORY_REQUIRED && this.canEndRound()) {
            this.beginVictory();
        }

        if (this.phase === phasesEnum.ENDING_REQUIRED && this.canEndRound()) {
            this.endRound();
        }

        if (this.phase === phasesEnum.DEFAULT) {
            this.itemManager.update(this);
        }

        this.players.forEach((player, index) => {
            if (!player.state.alive) {
                return;
            }

            player.update(this);

            if (!player.state.climbingRope) {
                handlePlatformCollisions(player, this.level);
            } else {
                player.state.grounded = false;
            }

            handleRopeCollisions(player, this.level);

            if (this.phase !== phasesEnum.ENDING) {
                player.handleInput(this.itemManager, this);
            }

            const otherPlayers = exceptIndex(this.players, index);
            handlePlayerCollisions(player, otherPlayers, this);

            handlePickupItemCollisions(
                player,
                this.level,
                this.itemManager,
                this
            );
        });
    }

    killPlayer(player, deathType, otherPlayer) {
        console.log(`Player ${player.id} died with death type ${deathType}`);

        player.state.alive = false;
        player.vx = 0;
        player.vy = 0;
        player.allowGravity = false;

        switch (deathType) {
            case deaths.GUN:
                player.playDisintegrated();
                break;
            case deaths.VOLTS:
                playEffect(
                    effects.VOLTS,
                    (player.x + otherPlayer.x) / 2,
                    (player.y + otherPlayer.y) / 2
                );
                player.vx =
                    player.x < otherPlayer.x ||
                    (player.x === otherPlayer.x && player.flippedh)
                        ? -playerConfig.POWERHIT_SPEED
                        : playerConfig.POWERHIT_SPEED;
                player.vy = -playerConfig.JUMP_IMPULSE;
                player.playDisintegrated();
                break;
            case deaths.SKULL:
                player.allowGravity = false;
                player.playSkulled();
                break;
            case deaths.MINE:
                player.vy = -playerConfig.POWERHIT_SPEED;
                player.playDisintegrated();
                break;
            case deaths.PUCK:
                player.vy = -playerConfig.POWERHIT_SPEED;
                player.playDisintegrated();
                break;
        }

        const activeTeammates = this.players.filter(
            p => p.state.alive && p.teamId === player.teamId
        );

        if (activeTeammates.length === 0) {
            this.phase = phasesEnum.VICTORY_REQUIRED;
            this.players.forEach(p => (p.state.inputEnabled = false));
        }
    }

    canEndRound() {
        if (this.itemManager.movingProjectilesCount > 0) {
            return false;
        }

        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];

            if (player.state.alive) {
                if (player.vx != 0) {
                    return false;
                }

                if (!player.sprite.animations.currentAnim.isFinished) {
                    return false;
                }

                if (!player.state.grounded && !player.state.climbingRope) {
                    return false;
                }
            } else {
                if (
                    player.sprite.inCamera &&
                    !player.sprite.animations.currentAnim.isFinished
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    beginVictory() {
        this.itemManager.removeItems();

        this.players.filter(p => p.state.alive).forEach(p => {
            p.celebrate();
        });

        this.phase = phasesEnum.ENDING_REQUIRED;
    }

    endRound() {
        this.phase = phasesEnum.ENDING;

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
