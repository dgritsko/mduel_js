import cfg from "../config";
import { locations } from "../../enums/locations";
import { animations } from "../../enums/animations";
import { matchingProps, now, debugRender } from "../util";
import { directions } from "../../enums/directions";

const running = {
    location: locations.PLATFORM,
    xVelocity: [cfg.runSpeed, -cfg.runSpeed]
};
const standing = { location: locations.PLATFORM, xVelocity: 0 };
const climbing = { location: locations.ROPE };
const air = { location: locations.AIR };

const getClosingSpeed = (a0, b0, v1, v2) => {
    const add = (a, b) => {
        return [a[0] + b[0], a[1] + b[1]];
    };

    const sub = (a, b) => {
        return [a[0] - b[0], a[1] - b[1]];
    };

    const dot = (a, b) => {
        return a[0] * b[0] + a[1] * b[1];
    };

    const mag = a => {
        return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
    };

    //https://gamedev.stackexchange.com/a/118164/5146
    return dot(sub(v1, v2), sub(a0, b0)) / mag(sub(a0, b0));
};

const runningVsRunning = {
    match: {
        first: running,
        second: running
    },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        [playerSnapshot, otherPlayerSnapshot].forEach(snapshot => {
            snapshot.update({
                yVelocity: -cfg.jumpSpeed,
                location: locations.AIR,
                xVelocity: -snapshot.state.xVelocity,
                animation: animations.BACKWARD_FALL,
                inputEnabled: false
            });
        });
    }
};

const runningVsStanding = {
    match: { first: running, second: standing },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        const fallAnimation =
            playerSnapshot.state.direction ===
            otherPlayerSnapshot.state.direction
                ? animations.FORWARD_FALL
                : animations.BACKWARD_FALL;

        otherPlayerSnapshot.update({
            xVelocity: playerSnapshot.state.xVelocity,
            yVelocity: -cfg.jumpSpeed,
            animation: fallAnimation,
            location: locations.AIR,
            inputEnabled: false
        });

        playerSnapshot.player.update([
            {
                inputEnabled: false,
                xVelocity: 0,
                animation: animations.STAND
            },
            {
                after: now() + 150,
                inputEnabled: true
            }
        ]);
    }
};

const ropeVsRope = {
    match: { first: climbing, second: climbing },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        playerSnapshot.update({
            xVelocity: -cfg.runSpeed,
            direction: directions.RIGHT,
            animation: animations.BACKWARD_FALL,
            location: locations.AIR,
            inputEnabled: false
        });

        otherPlayerSnapshot.update({
            xVelocity: cfg.runSpeed,
            direction: directions.RIGHT,
            animation: animations.FORWARD_FALL,
            location: locations.AIR,
            inputEnabled: false
        });
    }
};

// const airVsAir = {
//     match: { first: air, second: air },
//     update: (playerSnapshot, otherPlayerSnapshot) => {
//         player.update({
//             xVelocity: getDirectionVelocity(directions.LEFT),
//             inputEnabled: false,
//             yVelocity: -200,
//             animation: animations.BACKWARD_FALL,
//             location: locations.AIR
//         });

//         otherPlayer.update({
//             xVelocity: getDirectionVelocity(directions.RIGHT),
//             inputEnabled: false,
//             yVelocity: -200,
//             animation: animations.BACKWARD_FALL,
//             location: locations.AIR
//         });
//     }
// };

// const airVsStanding = {
//     match: { first: air, second: standing },
//     update: (playerSnapshot, otherPlayerSnapshot) => {
//         otherPlayer.update({
//             xVelocity: player.getState().xVelocity,
//             inputEnabled: false,
//             yVelocity: -200,
//             animation: animations.BACKWARD_FALL,
//             location: location.AIR
//         });
//     }
// };

const behaviors = [
    runningVsRunning,
    runningVsStanding,
    ropeVsRope
    // airVsAir,
    // airVsStanding
];

const getRelativeState = (first, second) => {
    const a = first.x - second.x;
    const b = first.y - second.y;
    const dist = Math.sqrt(a * a + b * b);

    const closingSpeed = getClosingSpeed(
        [first.x, first.y],
        [second.x, second.y],
        [first.xVelocity, first.yVelocity],
        [second.xVelocity, second.yVelocity]
    );

    const xDist = Math.abs(first.x - second.x);
    const yDist = Math.abs(first.y - second.y);

    return { dist, closingSpeed, xDist, yDist };
};

const handlePlayerCollisions = (playerSnapshot, otherPlayerSnapshots) => {
    const player = playerSnapshot.player;
    const playerState = playerSnapshot.state;

    otherPlayerSnapshots.forEach(otherPlayerSnapshot => {
        const otherPlayer = otherPlayerSnapshot.player;
        const otherPlayerState = otherPlayerSnapshot.state;

        const relativeState = getRelativeState(playerState, otherPlayerState);
        debugRender(relativeState);

        let behavior = null;

        const hitPlayer = game.physics.arcade.overlap(
            player.sprite,
            otherPlayer.sprite,
            (playerSprite, otherPlayerSprite) => {
                if (behavior) {
                    behavior.update(playerSnapshot, otherPlayerSnapshot);
                }
            },
            (playerSprite, otherPlayerSprite) => {
                if (relativeState.closingSpeed >= 0) {
                    return false;
                }

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
