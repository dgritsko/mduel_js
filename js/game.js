(function() {
    function preload() {
        // TODO: Load assets
    }

    function create() {
        makeLevel();
        
        var player1 = new MarshmallowDuel.Player();
    }

    function makeLevel() {
        var verticalSpacing = 64;
        var verticalOffset = 80;

        var horizontalSpacing = 32;
        var horizontalOffset = 32;

        var levelHeight = 5;
        var levelWidth = 18;

        var spawnWidth = 4;

        for (var i = 0; i < (levelHeight - 1); i++) {
            for (var j = 0; j < levelWidth; j++) {
                game.add.sprite((j * horizontalSpacing) + horizontalOffset, (i * verticalSpacing) + verticalOffset, 'main_platform');
            }
        }

        // Left spawn
        for (var j = 0; j < spawnWidth; j++) {
            game.add.sprite((j * horizontalSpacing) + horizontalOffset * 1.5, (4 * verticalSpacing) + verticalOffset, 'spawn_platform');
        }

        // Right spawn
        for (var j = levelWidth - spawnWidth + 1; j < levelWidth + 1; j++) {
            game.add.sprite((j * horizontalSpacing) - horizontalOffset * 0.5, (4 * verticalSpacing) + verticalOffset, 'spawn_platform');
        }

        // Ropes
        // TODO
        for (var i = 0; i < levelHeight; i++) {
            for (var j = 0; j < levelWidth; j++) {
                const anchor = game.add.sprite((j * horizontalSpacing) + 47, (i * verticalSpacing) + 32, 'rope_anchor');
                anchor.anchor.setTo(0.5);
            }
        }

        // Powerup spawns
        const topSpawn = game.add.sprite(game.world.centerX, 0, 'powerup_spawn');
        topSpawn.anchor.setTo(0.5, 0);

        const powerupYOffset = -32;
        const leftSpawn = game.add.sprite(0, game.world.height / 2 + powerupYOffset, 'powerup_spawn');
        leftSpawn.anchor.setTo(0.5, 0);
        leftSpawn.angle = -90;

        const rightSpawn = game.add.sprite(game.world.width, game.world.height / 2 + powerupYOffset, 'powerup_spawn');
        rightSpawn.anchor.setTo(0.5, 0);
        rightSpawn.scale.setTo(-1, 1);
        rightSpawn.angle = 90;

        // Marshmallows
        for (var j = 0; j < (game.world.width / horizontalSpacing); j++) {
            game.add.sprite(j * horizontalSpacing, game.world.height - horizontalSpacing, 'mallow');
        }
    }

    MarshmallowDuel.Game = {preload: preload, create: create};
})();