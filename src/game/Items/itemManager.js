import { PickupItem } from "./pickupItem";
import { items } from "../../enums/items";
import { spawnOrientations } from "../../enums/spawnOrientations";
import { itemConfig } from "../config";
import { playEffect, removeAtIndex, randomBetween } from "../util";
import { effects } from "../../enums/effects";
import { now } from "../util";
import { deaths } from "../../enums/deaths";

class ItemManager {
    constructor(level) {
        this.spawns = level.itemSpawns.map(i => ({
            spawnPoint: i.spawnPoint,
            orientation: i.orientation
        }));

        this.activeItems = game.add.group();

        this.activeProjectiles = [];

        // this.availableItems = Object.values(items);
        this.availableItems = [items.TNT];

        itemConfig.DEBUG_ITEMS.forEach(ti => {
            this.activeItems.add(new PickupItem(ti.x, ti.y, ti.type).sprite);
        });

        this.nextSpawnTime = now() + itemConfig.INITIAL_SPAWN_DELAY;
    }

    getVelocity(a, b) {
        a = typeof a === "undefined" ? 0 : a;
        b = typeof b === "undefined" ? 1 : b;

        let θ = (Math.random() + a) * Math.PI * b;

        const v = randomBetween(
            itemConfig.MINIMUM_ITEM_SPEED,
            itemConfig.MAXIMUM_ITEM_SPEED
        );
        return { x: Math.cos(θ) * v, y: Math.sin(θ) * v };
    }

    spawnItem() {
        const spawn = Phaser.ArrayUtils.getRandomItem(this.spawns);
        const type = Phaser.ArrayUtils.getRandomItem(this.availableItems);
        const item = new PickupItem(
            spawn.spawnPoint.x,
            spawn.spawnPoint.y,
            type
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
            this.activeItems.countLiving() < itemConfig.MAX_ITEMS;

        const canSpawn = this.nextSpawnTime < now();

        if (shouldSpawn && canSpawn) {
            const spawnDelay = randomBetween(
                itemConfig.MINIMUM_SPAWN_DELAY,
                itemConfig.MAXIMUM_SPAWN_DELAY
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
                playEffect(effects.GRAY_PUFF, item.x, item.y);
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
