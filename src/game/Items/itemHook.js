import { Item } from "./item";
import { items } from "../../enums/items";
import { playerConfig } from "../config";

export class ItemHook extends Item {
    constructor(player) {
        super(items.HOOK);

        this.canFireStanding = false;
        this.canFireCrouching = false;
        this.canFireInAir = true;
        this.canMoveWhileFiring = true;
        this.ammo = -1;

        this.floorGrabTimer = 0;
    }

    destroy(player) {
        super.destroy(player);
    }

    update(player) {
        super.update(player);

        //     if (pawn->isOnRope() || pawn->isOnGround() && isFiring())
        // 	stopFiring();

        // bWasFiring = bFiring;

        // if (!isFiring() && wasFiring())
        // 	pawn->updateAnimation();
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

        if (player.state.wasTouchingRope) {
            // rope grabbing first
            // pawn->climbRope(false);
            player.vx = 0;
        } else {
            const xpos = player.flippedh
                ? player.sprite.body.left
                : player.sprite.body.right;
            const ypos = player.y;

            for (
                let i = 0;
                i < gameManager.level.platforms.children.length;
                i++
            ) {
                const platform = gameManager.level.platforms.children[i];

                if (platform.getBounds().contains(xpos, ypos)) {
                    player.vy = -playerConfig.JUMP_IMPULSE * (2 / 3);
                    // 			floorGrabTimer = spriteObject::TICKSPERFRAME*3;
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
