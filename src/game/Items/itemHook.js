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

                console.log(platform.getBounds());

                if (platform.getBounds().contains(xpos, ypos)) {
                    player.vy = -gameConfig.PLAYER_JUMP_IMPULSE * (2 / 3);
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
