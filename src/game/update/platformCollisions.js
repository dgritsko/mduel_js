const handlePlatformCollisions = (player, level) => {
    const hitPlatform = game.physics.arcade.collide(
        player.sprite,
        level.platforms,
        () => {
            player.state.grounded = true;
        },
        (player, platform) =>
            player.body.velocity.y > 0 &&
            player.body.bottom <= platform.body.bottom
    );

    if (!hitPlatform) {
        player.state.grounded = false;
    }
};

export { handlePlatformCollisions };
