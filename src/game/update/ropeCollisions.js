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

                // TODO: move this to a constant
                return Math.abs(dist) <= 5;
            }
        );

        hitRope = hitRope || hitCurrentRope;
    });

    if (!hitRope) {
        player.state.touchingRope = null;
    }
}

export { handleRopeCollisions };
