import { playerConfig } from "../config";

const except = (items, index) => {
    const before = items.slice(0, index);
    const after = items.slice(index + 1);

    return [...before, ...after];
};

const collideNormally = (playerA, playerB) => {
    playerA.state.climbingRope = false;
    playerB.state.climbingRope = false;

    const playerAflippedh = playerA.sprite.scale.x === -1;
    const playerBflippedh = playerB.sprite.scale.x === -1;

    if (playerA.sprite.x === playerB.sprite.x) {
        if (playerA.sprite.y < playerB.sprite.y) {
            playerA.bounce(playerAflippedh);
            playerB.bounce(!playerBflippedh);
        } else {
            playerA.bounce(!playerAflippedh);
            playerB.bounce(playerBflippedh);
        }
    } else {
        if (playerA.sprite.x < playerB.sprite.x) {
            playerA.bounce(playerAflippedh);
            playerB.bounce(!playerBflippedh);
        } else {
            playerA.bounce(!playerAflippedh);
            playerB.bounce(playerBflippedh);
        }
    }

    playerA.apply({
        allowGravity: true,
        vy: -playerConfig.JUMP_IMPULSE * 2 / 3
    });

    playerB.apply({
        allowGravity: true,
        vy: -playerConfig.JUMP_IMPULSE * 2 / 3
    });
};

const updateAfterCollision = (player, otherPlayer) => {
    // regular contact
    if (
        !player.state.crouching ||
        (player.state.crouching &&
            (otherPlayer.state.rolling || !otherPlayer.state.grounded))
    ) {
        //     //if other player gets under your feet
        //     if ((o->bCrouching || o->bRolling) && wasOnGround() && !bCrouching && !bRolling)
        //     {
        //         dontMove = (vx == 0 && o->bRolling);
        //         bounce(true);
        //         if (dontMove) vx = 0;
        //         ignoreUntilUntouched = other;
        //         vy = JUMPIMPULSE*2/3;
        //         if (o->usingInvis())
        //             lastCollision = CS_INVISPLAYER;
        //         else if (o->bJustUnwarped)
        //             lastCollision = CS_WARPEDPLAYER;
        //         else
        //             lastCollision = CS_BASICHIT;
        //     }
        //     //if you get under other player's feet
        //     else if (bRolling && o->wasOnGround() && !o->bCrouching && !o->bRolling)
        //     {
        //         dontMove = (o->getvx() == 0);
        //         o->bounce(true);
        //         if (dontMove) o->setvx(0);
        //         ignoreUntilUntouched = other;
        //         o->vy = JUMPIMPULSE*2/3;
        //         if (usingInvis())
        //             o->lastCollision = CS_INVISPLAYER;
        //         else if (bJustUnwarped)
        //             o->lastCollision = CS_WARPEDPLAYER;
        //         else
        //             o->lastCollision = CS_BASICHIT;
        //     }
        //     //otherwise we must be talking a normal bump!
        //     else {
        collideNormally(player, otherPlayer);
        //         o->collideNormally(this);
        //         collideNormally(o);
        //         if (o->usingInvis())
        //             lastCollision = CS_INVISPLAYER;
        //         else if (o->bJustUnwarped)
        //             lastCollision = CS_WARPEDPLAYER;
        //         else
        //             lastCollision = CS_BASICHIT;
        //         if (usingInvis())
        //             o->lastCollision = CS_INVISPLAYER;
        //         else if (bJustUnwarped)
        //             o->lastCollision = CS_WARPEDPLAYER;
        //         else
        //             o->lastCollision = CS_BASICHIT;
        //     }
    }
};

const handlePlayerCollisions = players => {
    players.forEach((player, index) => {
        const otherPlayers = except(players, index);

        otherPlayers.forEach(otherPlayer => {
            const hitPlayer = game.physics.arcade.collide(
                player.sprite,
                otherPlayer.sprite,
                () => {
                    updateAfterCollision(player, otherPlayer);
                }
            );
        });
    });
};

export { handlePlayerCollisions };
