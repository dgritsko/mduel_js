import { Item } from "./item";
import { items } from "../../enums/items";
import { gameConfig } from "../config";
import { animations } from "../../enums/animations";

export class ItemHook extends Item {
    constructor(player) {
        super(items.HOOK);

        this.canFireInAir = true;
        this.canMoveWhileFiring = true;

        this.ammo = -1;

        this.floorGrabTimer = 0;

        // TODO: Figure out what sprite to use
        this.hook = game.add.sprite(2, -16, "items");
        this.hook.frame = 13;
        this.hook.anchor.setTo(0.5);
        this.hook.scale.setTo(-1, 1);

        player.sprite.addChild(this.hook);
    }

    destroy(player) {
        super.destroy(player);

        this.hook.destroy();
    }

    update(player) {
        super.update(player);

        //     if (pawn->isOnRope() || pawn->isOnGround() && isFiring())
        // 	stopFiring();

        // bWasFiring = bFiring;

        // if (!isFiring() && wasFiring())
        // 	pawn->updateAnimation();

        if (player.sprite.frame === 37) {
            this.hook.alpha = 1;
            this.hook.x = 2;
            this.hook.y = -16;
            this.hook.scale.setTo(-1, 1);
        } else if (player.sprite.frame === 38) {
            this.hook.alpha = 1;
            this.hook.x = 2;
            this.hook.y = 6;
            this.hook.scale.setTo(-1, -1);
        } else {
            this.hook.alpha = 0;
        }
    }

    fire(player, itemManager, gameManager) {
        if (!this.canFire(player)) {
            return;
        }

        super.fire(player);

        //     if (floorGrabTimer > 0)
        // {
        // 	pawn->setFrame(38);
        // 	floorGrabTimer--;
        // } else
        // 	pawn->setFrame(37);

        player.animation = animations.HOOK;

        if (player.state.wasTouchingRope) {
            // rope grabbing first
            // pawn->climbRope(false);

            player.climbRope(false);
            player.vx = 0;
        } else {
            const xpos = player.flippedh ? player.left : player.right;
            const ypos = player.y;

            for (
                let i = 0;
                i < gameManager.level.platforms.children.length;
                i++
            ) {
                const platform = gameManager.level.platforms.children[i];

                const bounds = new Phaser.Rectangle(
                    platform.x - platform.width / 2,
                    platform.y - platform.height * 1.5,
                    platform.width,
                    platform.height + platform.height
                );

                if (bounds.contains(xpos, ypos)) {
                    player.vy = -gameConfig.PLAYER_JUMP_IMPULSE * (2 / 3);
                    break;
                }
            }
        }
    }

    stopFiring(player) {
        super.stopFiring(player);

        this.floorGrabTimer = 0;
    }
}
