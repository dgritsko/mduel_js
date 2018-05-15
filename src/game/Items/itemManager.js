import { PickupItem } from "./pickupItem";
import { items } from "../../enums/items";
import { spawnOrientations } from "../../enums/spawnOrientations";
import { gameConfig } from "../config";
import { playEffect, removeAtIndex, randomBetween, playSound } from "../util";
import { effects } from "../../enums/effects";
import { now } from "../util";
import { deaths } from "../../enums/deaths";
import { sounds } from "../../enums/sounds";

class ItemManager {
    constructor(level, config) {
        this.config = config;

        this.spawns = level.itemSpawns.map(i => ({
            spawnPoint: i.spawnPoint,
            orientation: i.orientation
        }));

        this.activeItems = game.add.group();

        this.activeProjectiles = [];

        gameConfig.DEBUG_ITEMS.forEach(ti => {
            this.activeItems.add(
                new PickupItem(ti.x, ti.y, ti.type, this).sprite
            );
        });

        this.nextSpawnTime = now() + this.config.initialSpawnDelay;
    }

    getVelocity(a, b) {
        a = typeof a === "undefined" ? 0 : a;
        b = typeof b === "undefined" ? 1 : b;

        let θ = (Math.random() + a) * Math.PI * b;

        const v = randomBetween(
            this.config.minItemSpeed,
            this.config.maxItemSpeed
        );
        return { x: Math.cos(θ) * v, y: Math.sin(θ) * v };
    }

    spawnItem() {
        const spawn = Phaser.ArrayUtils.getRandomItem(this.spawns);
        const type = Phaser.ArrayUtils.getRandomItem(
            this.config.availableItems
        );
        const item = new PickupItem(
            spawn.spawnPoint.x,
            spawn.spawnPoint.y,
            type,
            this
        );

        let vel;

        switch (spawn.orientation) {
            case spawnOrientations.TOP:
                vel = this.getVelocity();
                break;
            case spawnOrientations.RIGHT:
                vel = this.getVelocity(0.5, -1);
                break;
            case spawnOrientations.LEFT:
                vel = this.getVelocity(-0.5);
                break;
        }

        if (vel) {
            item.vx = vel.x;
            item.vy = vel.y;
        }

        return item;
    }

    removeItems() {
        for (let i = this.activeItems.children.length - 1; i >= 0; i--) {
            const item = this.activeItems.children[i];

            playEffect(effects.GRAY_PUFF, item.x, item.y);
            item.destroy();
        }
    }

    update(gameManager) {
        const shouldSpawn =
            this.activeItems.countLiving() < this.config.maxItems;

        const canSpawn = this.nextSpawnTime < now();

        if (shouldSpawn && canSpawn) {
            const spawnDelay = randomBetween(
                this.config.minSpawnDelay,
                this.config.maxSpawnDelay
            );

            this.nextSpawnTime = now() + spawnDelay;

            const item = this.spawnItem();

            playEffect(effects.PURPLE_PUFF, item.x, item.y);

            this.activeItems.add(item.sprite);
        }

        for (let i = this.activeItems.children.length - 1; i >= 0; i--) {
            const item = this.activeItems.children[i];

            if (
                item.alive &&
                item.data.despawnTime &&
                item.data.despawnTime < now()
            ) {
                playEffect(effects.DIE, item.x, item.y);
                item.destroy();
            }
        }

        for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.activeProjectiles[i];

            if (!projectile.sprite.inCamera) {
                removeAtIndex(this.activeProjectiles, i);
                continue;
            }

            if (projectile.type === items.GRENADE) {
                if (
                    projectile.vy > 0 &&
                    gameManager.collideWithPlatforms(projectile.sprite, true)
                ) {
                    removeAtIndex(this.activeProjectiles, i);
                    projectile.sprite.kill();
                }
            } else if (projectile.type === items.PUCK) {
                gameManager.collideWithPlatforms(projectile.sprite);

                const hitPlayer = gameManager.collideWithPlayer(
                    projectile.sprite
                );

                if (hitPlayer) {
                    console.log("hit player with puck");

                    gameManager.killPlayer(hitPlayer, deaths.PUCK);

                    playSound(sounds.BOOM);

                    playEffect(effects.MINE, projectile.x, projectile.bottom);

                    removeAtIndex(this.activeProjectiles, i);
                    projectile.sprite.kill();
                }
            } else if (projectile.type === items.MINE) {
                if (gameManager.collideWithPlatforms(projectile.sprite)) {
                    projectile.wasPlanted = true;
                } else if (projectile.wasPlanted) {
                    console.log("platform holding mine was destroyed");

                    removeAtIndex(this.activeProjectiles, i);
                    projectile.sprite.kill();
                    break;
                }

                const hitPlayer = gameManager.collideWithPlayer(
                    projectile.sprite
                );

                if (hitPlayer) {
                    console.log("hit player with mine");

                    gameManager.killPlayer(hitPlayer, deaths.MINE);

                    playSound(sounds.BOOM);

                    playEffect(effects.MINE, projectile.x, projectile.bottom);

                    removeAtIndex(this.activeProjectiles, i);
                    projectile.sprite.kill();
                }
            }
        }
    }

    addProjectile(projectile) {
        this.activeProjectiles.push(projectile);
    }

    get movingProjectilesCount() {
        return this.activeProjectiles.filter(p => p.vx > 0).length;
    }
}

export { ItemManager };
