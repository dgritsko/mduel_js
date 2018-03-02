import { removeAtIndex } from "../util";

const handlePlayerCollisions = (player, otherPlayers) => {
    otherPlayers.forEach(otherPlayer => {
        const hitPlayer = game.physics.arcade.overlap(
            player.sprite,
            otherPlayer.sprite,
            () => {
                if (player.recentCollisionIds.indexOf(otherPlayer.id) !== -1) {
                    return;
                }

                player.recentCollisionIds.push(otherPlayer.id);

                player.collideWithPlayer(otherPlayer);
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
