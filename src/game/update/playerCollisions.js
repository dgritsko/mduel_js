import { removeAtIndex } from "../util";

const handlePlayerCollisions = (player, otherPlayers, gameManager) => {
    otherPlayers.forEach(otherPlayer => {
        const hitPlayer = game.physics.arcade.overlap(
            player.sprite,
            otherPlayer.sprite,
            () => {
                const playerJustLanded =
                    !player.state.wasGrounded && player.state.grounded;

                if (
                    player.recentCollisionIds.indexOf(otherPlayer.id) !== -1 &&
                    !playerJustLanded
                ) {
                    return;
                }

                player.recentCollisionIds.push(otherPlayer.id);

                player.collideWithPlayer(otherPlayer, gameManager);
            }
        );

        if (!hitPlayer) {
            const collisionIndex = player.recentCollisionIds.indexOf(
                otherPlayer.id
            );
            if (collisionIndex !== -1) {
                removeAtIndex(player.recentCollisionIds, collisionIndex);
            }
        }
    });
};

export { handlePlayerCollisions };
