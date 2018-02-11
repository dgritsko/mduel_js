import cfg from "../config";
import { locations } from "../../enums/locations";
import { animations } from "../../enums/animations";
import { now } from "../util";

const handlePlatformCollisions = (snapshot, level) => {
    const player = snapshot.player;

    // TODO: Refactor this collision system
    const hitPlatform = game.physics.arcade.collide(
        player.sprite,
        level.platforms,
        (_, platform) => {
            if (
                player.location !== locations.PLATFORM &&
                player.location !== locations.ROPE
            ) {
                player.update([
                    {
                        location: locations.PLATFORM,
                        animation: animations.TRANSITION,
                        inputEnabled: false,
                        xVelocity: 0
                    },
                    {
                        animation: animations.STAND,
                        inputEnabled: true
                    }
                ]);
            }
        },
        (player, platform) => {
            if (player.body.velocity.y <= 0) {
                return false;
            }

            if (snapshot.state.location === locations.ROPE) {
                return false;
            }

            const maxY = player.y + player.offsetY;

            const yCollision =
                maxY >= platform.y && maxY < platform.y + cfg.platformYDist;

            const platformXDist = 10;

            const xCollision =
                player.x + platformXDist >= platform.x &&
                player.x - platformXDist <= platform.x + platform.width;

            return yCollision && xCollision;
        }
    );

    if (!hitPlatform && player.location === locations.PLATFORM) {
        player.update({
            location: locations.AIR,
            animation: animations.STAND_FALL,
            inputEnabled: false,
            yVelocity: cfg.fallSpeed / 2
        });
    }
};

export { handlePlatformCollisions };
