import { PickupItem } from "./pickupItem";
import { items } from "../../enums/items";
import { spawnOrientations } from "../../enums/spawnOrientations";
import { itemConfig } from "../config";
import { playEffect, debugRender, removeAtIndex } from "../util";
import { effects } from "../../enums/effects";

class ItemManager {
    constructor(level) {
        this.spawns = level.itemSpawns.map(i => ({
            spawnPoint: i.spawnPoint,
            orientation: i.orientation
        }));

        this.activeItems = game.add.group();

        this.activeProjectiles = [];

        // this.availableItems = Object.values(items);
        this.availableItems = [items.BOOTS];

        itemConfig.TEST_ITEMS.forEach(ti => {
            this.activeItems.add(new PickupItem(ti.x, ti.y, ti.type).sprite);
        });
    }

    getVelocity(a, b) {
        a = typeof a === "undefined" ? 0 : a;
        b = typeof b === "undefined" ? 1 : b;

        let θ = (Math.random() + a) * Math.PI * b;

        const v = itemConfig.ITEM_SPEED;
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

    update(level) {
        while (this.activeItems.countLiving() < itemConfig.MAX_ITEMS) {
            const item = this.spawnItem();

            playEffect(effects.PURPLE_PUFF, item.x, item.y);

            this.activeItems.add(item.sprite);
        }

        for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.activeProjectiles[i];

            if (!projectile.sprite.inCamera) {
                removeAtIndex(this.activeProjectiles, i);
                continue;
            }

            const hitPlatform = game.physics.arcade.collide(
                projectile.sprite,
                level.platforms,
                () => {}
            );

            if (hitPlatform) {
                switch (projectile.type) {
                    case items.PUCK:
                        break;
                    case items.MINE:
                        break;
                    case items.GRENADE:
                        playEffect(
                            effects.GRAY_PUFF,
                            projectile.x,
                            projectile.y
                        );
                        break;
                }
            }
        }
    }

    addProjectile(projectile) {
        this.activeProjectiles.push(projectile);
    }
}

export { ItemManager };
