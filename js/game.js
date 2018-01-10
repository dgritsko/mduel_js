(function() {
    let level;
    let player1;

    function preload() {
        // TODO: Load assets
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 800;

        level = makeLevel();
        
        player1 = new MarshmallowDuel.Player();

        player1.input = game.input.keyboard.createCursorKeys();
    }

    function update() {
        game.physics.arcade.collide(player1.sprite, level.platforms, (player, platform) => {

        }, (player, platform) => {
            return (player.y + player.offsetY) >= platform.y;
        });

        if (player1.input.left.isDown) {
            player1.sprite.body.velocity.x = -100;
            player1.sprite.scale.setTo(-1, 1);
            player1.sprite.animations.play('run');
        } else if (player1.input.right.isDown) {
            player1.sprite.body.velocity.x = 100;
            player1.sprite.scale.setTo(1, 1);
            player1.sprite.animations.play('run');
        } else {
            player1.sprite.body.velocity.x = 0;
            player1.sprite.animations.play('stand');
            player1.sprite.animations.stop();
        }

        game.debug.body(player1.sprite);
    }

    function makeLevel() {
        const verticalSpacing = 64;
        const verticalOffset = 80;

        const horizontalSpacing = 32;
        const horizontalOffset = 32;

        const levelHeight = 5;
        const levelWidth = 18;

        const spawnWidth = 4;

        const platforms = game.add.group();

        for (let i = 0; i < (levelHeight - 1); i++) {
            for (let j = 0; j < levelWidth; j++) {
                const platform = game.add.sprite((j * horizontalSpacing) + horizontalOffset, (i * verticalSpacing) + verticalOffset, 'main_platform');
                platforms.add(platform);
            }
        }

        // Left spawn
        for (let j = 0; j < spawnWidth; j++) {
            const platform = game.add.sprite((j * horizontalSpacing) + horizontalOffset * 1.5, (4 * verticalSpacing) + verticalOffset, 'spawn_platform');
            platforms.add(platform);
        }

        // Right spawn
        for (let j = levelWidth - spawnWidth + 1; j < levelWidth + 1; j++) {
            const platform = game.add.sprite((j * horizontalSpacing) - horizontalOffset * 0.5, (4 * verticalSpacing) + verticalOffset, 'spawn_platform');
            platforms.add(platform);
        }

        platforms.children.forEach(p => {
            game.physics.enable(p);
            p.body.moves = false;
            p.body.immovable = true;
        });

        // Ropes
        // TODO
        for (let i = 0; i < levelHeight; i++) {
            for (let j = 0; j < levelWidth; j++) {
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
        const marshmallows = game.add.group();
        for (let j = 0; j < (game.world.width / horizontalSpacing); j++) {
            const marshmallow = game.add.sprite(j * horizontalSpacing, game.world.height - horizontalSpacing, 'mallow');
            marshmallows.add(marshmallow);
        }

        return {
            platforms,
            topSpawn,
            leftSpawn,
            rightSpawn,
            marshmallows
        }
    }

    MarshmallowDuel.Game = {preload: preload, create: create, update: update};
})();