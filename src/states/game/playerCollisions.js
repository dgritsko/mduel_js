import cfg from "../../gameConfig";
import { locations } from "../../enums/locations";
import { animations } from "../../enums/animations";
import { matchingProps, now } from "../../util/util";
import { directions } from "../../enums/directions";

const running = {
    location: locations.PLATFORM,
    xVelocity: [cfg.runSpeed, -cfg.runSpeed]
};
const standing = { location: locations.PLATFORM, xVelocity: 0 };
const climbing = { location: locations.ROPE };
const air = { location: locations.AIR };

const getDirectionVelocity = d => {
    switch (d) {
        case directions.LEFT:
            return -cfg.runSpeed;
        case directions.RIGHT:
            return cfg.runSpeed;
        default:
            return 0;
    }
};

const runningVsRunning = {
    match: {
        first: running,
        second: running
    },
    update: (player, otherPlayer) => {
        player.update({
            xVelocity: getDirectionVelocity(otherPlayer.getState().direction),
            yVelocity: -200,
            animation: animations.BACKWARD_FALL,
            location: locations.AIR
        });

        otherPlayer.update({
            xVelocity: getDirectionVelocity(player.getState().direction),
            yVelocity: -200,
            animation: animations.BACKWARD_FALL,
            location: locations.AIR
        });
    }
};

const runningVsStanding = {
    match: { first: running, second: standing },
    update: (player, otherPlayer) => {
        player.update([
            {
                inputEnabled: false,
                xVelocity: 0,
                animation: animations.STAND
            },
            {
                after: now() + 50,
                inputEnabled: true
            }
        ]);

        otherPlayer.update({
            xVelocity: getDirectionVelocity(player.getState().direction),
            yVelocity: -200,
            animation: animations.FORWARD_FALL,
            location: locations.AIR
        });
    }
};

const ropeVsRope = {
    match: { first: climbing, second: climbing },
    update: (player, otherPlayer) => {
        player.update({
            xVelocity: -cfg.runSpeed,
            direction: directions.LEFT,
            animation: animations.FORWARD_FALL,
            location: locations.AIR,
            inputEnabled: false
        });

        otherPlayer.update({
            xVelocity: cfg.runSpeed,
            direction: directions.RIGHT,
            animation: animations.FORWARD_FALL,
            location: locations.AIR,
            inputEnabled: false
        });
    }
};

const airVsAir = {
    match: { first: air, second: air },
    update: (player, otherPlayer) => {
        player.update({
            xVelocity: getDirectionVelocity(directions.LEFT),
            inputEnabled: false,
            yVelocity: -200,
            animation: animations.BACKWARD_FALL,
            location: locations.AIR
        });

        otherPlayer.update({
            xVelocity: getDirectionVelocity(directions.RIGHT),
            inputEnabled: false,
            yVelocity: -200,
            animation: animations.BACKWARD_FALL,
            location: locations.AIR
        });
    }
};

const airVsStanding = {
    match: { first: air, second: standing },
    update: (player, otherPlayer) => {
        otherPlayer.update({
            xVelocity: player.getState().xVelocity,
            inputEnabled: false,
            yVelocity: -200,
            animation: animations.BACKWARD_FALL,
            location: location.AIR
        });
    }
};

const behaviors = [
    runningVsRunning,
    runningVsStanding,
    ropeVsRope,
    airVsAir,
    airVsStanding
];

const handlePlayerCollisions = (player, otherPlayers) => {
    const playerState = player.getState();

    otherPlayers.forEach(otherPlayer => {
        const otherPlayerState = otherPlayer.getState();

        let behavior = null;

        const hitPlayer = game.physics.arcade.collide(
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
