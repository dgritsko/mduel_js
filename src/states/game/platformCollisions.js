import cfg from '../../gameConfig';
import { locations } from '../../enums/locations';
import { animations } from '../../enums/animations';

const handlePlatformCollisions = (player, level) => {
    // TODO: Refactor this collision system
    const hitPlatform = game.physics.arcade.collide(player.sprite, level.platforms, (_, platform) => {
        if (player.location !== locations.PLATFORM && player.location !== locations.ROPE) {
            player.applyState({ location: locations.PLATFORM, animation: animations.STAND });    
        }
        
    }, (player, platform) => {
        const maxY = player.y + player.offsetY;

        const yCollision = maxY >= platform.y && maxY < (platform.y + cfg.platformYDist);

        const platformXDist = 10;

        const xCollision = (player.x + platformXDist) >= platform.x && (player.x - platformXDist) <= (platform.x + platform.width);

        return yCollision && xCollision;
    });

    if (!hitPlatform && player.location === locations.PLATFORM) {
        player.applyState({ location: locations.PLATFORM, location: locations.AIR });
    }
}

export { handlePlatformCollisions }