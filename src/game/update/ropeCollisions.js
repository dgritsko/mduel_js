import { gameConfig } from "../config";

function handleRopeCollisions(player, level) {
    let hitRope = false;
    level.ropes.forEach(r => {
        const hitCurrentRope = game.physics.arcade.overlap(
            player.sprite,
            r.segments,
            () => {
                player.state.touchingRope = r;
            },
            (player, segment) => {
                const dist = player.body.center.x - segment.body.center.x;
                return Math.abs(dist) <= gameConfig.ROPE_THRESHOLD;
            }
        );

        hitRope = hitRope || hitCurrentRope;
    });

    if (!hitRope) {
        player.state.touchingRope = null;
        player.allowGravity = true;
    }
}

export { handleRopeCollisions };
