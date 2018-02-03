import cfg from '../../gameConfig';
import { locations } from '../../enums/locations';
import { animations } from '../../enums/animations';

const handlePlatformCollisions = (player, level) => {
    // TODO: Refactor this collision system
    const hitPlatform = game.physics.arcade.collide(player.sprite, level.platforms, (_, platform) => {
        if (player.location !== locations.PLATFORM && player.location !== locations.ROPE) {
            player.sprite.animations.play('stand');
            player.location = locations.PLATFORM;
        }
    }, (player, platform) => {
        const maxY = player.y + player.offsetY;

        const yCollision = maxY >= platform.y && maxY < (platform.y + cfg.platformYDist);

        const platformXDist = 10;

        const xCollision = (player.x + platformXDist) >= platform.x && (player.x - platformXDist) <= (platform.x + platform.width);

        return yCollision && xCollision;
    });

    if (!hitPlatform) {
        switch (player.location) {
            case locations.PLATFORM:
                player.sprite.animations.play(animations.STAND_FALL);
                player.location = locations.AIR;
                break;
            case locations.AIR:
                if ((player.sprite.x + (player.sprite.offsetX / 2)) <= 0) {
                    player.sprite.body.velocity.x = Math.abs(player.sprite.body.velocity.x);
                    player.sprite.animations.play(animations.BACKWARD_FALL);
                } else if ((player.sprite.x + (player.sprite.offsetX / 2)) >= game.world.width) {
                    player.sprite.body.velocity.x = -Math.abs(player.sprite.body.velocity.x);
                    player.sprite.animations.play(animations.FORWARD_FALL);
                }

                if (player.sprite.y > 500) {
                    // TODO: FIDS
                    player.sprite.y -= 500;
                }
                break;
        }
    }
}

export { handlePlatformCollisions }