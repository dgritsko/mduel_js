import cfg from "../config";
import { locations } from "../../enums/locations";
import { animations } from "../../enums/animations";

const handleLevelCollisions = playerSnapshot => {
    const { player } = playerSnapshot;

    if (player.location !== locations.AIR) {
        return;
    }

    if (player.sprite.x + player.sprite.offsetX / 2 <= 0) {
        player.update({
            animation: animations.BACKWARD_FALL,
            xVelocity: cfg.runSpeed
        });
    } else if (
        player.sprite.x + player.sprite.offsetX / 2 >=
        game.world.width
    ) {
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
