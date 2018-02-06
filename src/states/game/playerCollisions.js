import cfg from "../../gameConfig";
import { locations } from "../../enums/locations";
import { animations } from "../../enums/animations";
import { matchingProps } from "../../util/util";

const running = {
    location: locations.PLATFORM,
    xVelocity: [cfg.runSpeed, -cfg.runSpeed]
};
const standing = { location: locations.PLATFORM, xVelocity: 0 };

const climbing = { location: locations.ROPE };

const behaviors = [
    {
        match: {
            first: running,
            second: running
        },
        update: (player, otherPlayer) => {
            player.update({
                xVelocity: -player.getState().xVelocity,
                yVelocity: -200,
                animation: animations.STAND_FALL,
                location: locations.AIR
            });

            otherPlayer.update({
                xVelocity: -otherPlayer.getState().xVelocity,
                yVelocity: -200,
                animation: animations.STAND_FALL,
                location: locations.AIR
            });
        }
    },
    {
        match: { first: running, second: standing },
        update: (player, otherPlayer) => {
            otherPlayer.update({
                xVelocity: player.getState().xVelocity,
                yVelocity: -200,
                animation: animations.STAND_FALL,
                location: locations.AIR
            });
        }
    }
];

const handlePlayerCollisions = (player, otherPlayers) => {
    const playerState = player.getState();

    otherPlayers.forEach(otherPlayer => {
        const otherPlayerState = otherPlayer.getState();

        let behavior = null;

        const hitPlayer = game.physics.arcade.overlap(
            player.sprite,
            otherPlayer.sprite,
            (playerSprite, otherPlayerSprite) => {
                if (behavior) {
                    behavior.update(player, otherPlayer);
                }
            },
            (playerSprite, otherPlayerSprite) => {
                for (let i = 0; i < behaviors.length; i++) {
                    behavior = behaviors[i];

                    const playerProps = matchingProps(
                        playerState,
                        behavior.match.first || {}
                    );
                    const otherPlayerProps = matchingProps(
                        otherPlayerState,
                        behavior.match.second || {}
                    );

                    if (
                        playerProps.actual === playerProps.target &&
                        otherPlayerProps.actual === otherPlayerProps.target
                    ) {
                        return true;
                    }
                }

                return false;
            }
        );
    });
};

export { handlePlayerCollisions };
