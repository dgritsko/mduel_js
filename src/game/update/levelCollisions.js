import cfg from "../config";
import { locations } from "../../enums/locations";
import { animations } from "../../enums/animations";

const handleLevelCollisions = playerSnapshot => {
    const { player } = playerSnapshot;

    if (player.location !== locations.AIR) {
        return;
    }

    if (player.sprite.x < cfg.wallThreshold) {
        player.update({
            animation: animations.BACKWARD_FALL,
            xVelocity: cfg.runSpeed
        });
    }

    if (player.sprite.x > game.world.width - cfg.wallThreshold) {
        player.update({
            animation: animations.BACKWARD_FALL,
            xVelocity: -cfg.runSpeed
        });
    }

    if (player.sprite.y > 500) {
        // TODO: FIDS
        player.sprite.y -= 500;
    }
};

export { handleLevelCollisions };
