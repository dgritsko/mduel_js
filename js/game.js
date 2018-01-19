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
        // TODO: Import this?
        const locations = MarshmallowDuel.Player.Locations;

        let behaviors = [
            {
                match: { up: true, location: locations.ROPE },
                act:
                    p => {
                        p.sprite.animations.play('climb');
                        p.sprite.body.moves = false;
                        p.sprite.y = p.sprite.y - 2;
                    }
            },
            {
                match: { down: true, location: locations.ROPE },
                act:
                    p => {
                        p.sprite.animations.play('climb');
                        p.sprite.body.moves = false;
                        p.sprite.y = p.sprite.y + 2;
                    }
            },
            {
                match: { right: true, location: locations.ROPE },
                act: 
                    p => {
                        p.sprite.animations.play('stand_fall');
                        p.sprite.scale.setTo(-1, 1);
                        p.sprite.body.moves = true;
                        p.sprite.body.velocity.x = 100;
                        p.location = locations.AIR;
                    }
            },
            {
                match: { left: true, location: locations.ROPE },
                act: 
                    p => {
                        p.sprite.animations.play('stand_fall');
                        p.sprite.scale.setTo(1, 1);
                        p.sprite.body.moves = true;
                        p.sprite.body.velocity.x = -100;
                        p.location = locations.AIR;
                    }
            },
            {
                match: { location: locations.ROPE },
                act:
                    p => {
                        p.sprite.animations.stop();
                    }
            },
            { 
                match: { left: true, location: locations.PLATFORM }, 
                act: 
                    p => {
                        p.sprite.body.velocity.x = -100;
                        p.sprite.scale.setTo(-1, 1);
                        p.sprite.animations.play('run');
                    }
            },
            { 
                match: { right: true, location: locations.PLATFORM }, 
                act: 
                    p => {
                        p.sprite.body.velocity.x = 100;
                        p.sprite.scale.setTo(1, 1);
                        p.sprite.animations.play('run');
                    }
            },
            {
                match: { up: true, location: locations.PLATFORM },
                act:
                    p => {
                        const x = p.sprite.x;
                        const y = p.sprite.y + p.sprite.offsetY;
                        const ropes = level.ropes.filter(r => (r.x >= (x - 10) && r.x <= (x + 10))).filter(r => (y >= r.y && y <= (r.y + r.height + 10)));

                        if (ropes.length > 0) {
                            p.location = locations.ROPE;
                            p.sprite.x = ropes[0].x;
                        } else {
                            p.sprite.body.velocity.y = -300;
                            p.sprite.animations.play('jump');
                            p.location = locations.AIR;
                        }
                    }
            },
            { 
                match: { location: locations.PLATFORM },
                act: 
                    p => {
                        p.sprite.body.velocity.x = 0;
                        p.sprite.animations.play('stand');
                    }
            }
        ];

        const players = [player1];

        players.forEach(player => {
            // TODO: Refactor this collision system
            game.physics.arcade.collide(player.sprite, level.platforms, (_, platform) => {
                if (player.location !== locations.PLATFORM && player.location !== locations.ROPE) {
                    player.sprite.animations.play('stand');
                    player.location = locations.PLATFORM;
                }
            }, (player, platform) => {
                const maxY = player.y + player.offsetY;

                const collision = maxY >= platform.y && maxY < (platform.y + 16);

                return collision;
            });

            const curr = { 
                left: player.input.left.isDown,
                right: player.input.right.isDown,
                up: player.input.up.isDown,
                down: player.input.down.isDown,
                location: player.location
            };
    
            for (let i = 0; i < behaviors.length; i++) {
                const behavior = behaviors[i];
    
                const propsMatch = x => (typeof(behavior.match[x]) === 'undefined' || behavior.match[x] == curr[x]);
    
                let isMatch = true;
    
                isMatch = isMatch && propsMatch('left');
                isMatch = isMatch && propsMatch('right');
                isMatch = isMatch && propsMatch('up');
                isMatch = isMatch && propsMatch('down');
                isMatch = isMatch && propsMatch('location');
    
                if (isMatch) {
                    //game.debug.text('Matched: ' + i, 2, 14, '#ff0000');

                    behavior.act(player);
                    break;
                }
            }
        });
        
        //game.debug.text(player1.sprite.animations, 2, 14, '#ff0000');
        //game.debug.body(player1.sprite);
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
        const platformInfos = generatePlatforms();

        platformInfos.forEach(info => {
            const x = info.column * horizontalSpacing + horizontalOffset;
            const y = info.row * verticalSpacing + verticalOffset;
            const spriteName = info.isSpawn ? 'spawn_platform' : 'main_platform';
            const platform = game.add.sprite(x, y, spriteName);
            platforms.add(platform);
        });

        platforms.children.forEach(p => {
            game.physics.enable(p);
            p.body.moves = false;
            p.body.immovable = true;
        });

        // Ropes
        const ropes = generateRopes(platformInfos);

        ropes.forEach(r => {
            r.x = (r.column * horizontalSpacing) + 47;
            r.y = (r.row * verticalSpacing) + 32;
            r.height = verticalSpacing * r.length - 15

            const graphics = game.add.graphics(r.x + 0.5, r.y);
            graphics.lineStyle(2, 0x8C6414, 1);
            graphics.lineTo(0, r.height);

            const anchor = game.add.sprite(r.x, r.y, 'rope_anchor');
            anchor.anchor.setTo(0.5);
        });

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
            marshmallows,
            ropes
        }
    }

    const generatePlatforms = () => {
        let result = [];

        const verticalSpacing = 64;
        const verticalOffset = 80;

        const horizontalSpacing = 32;
        const horizontalOffset = 32;

        const levelHeight = 5;
        const levelWidth = 18;

        const spawnWidth = 4;

        // Left spawn
        for (let j = 0; j < spawnWidth; j++) {
            result.push({ row: 4, column: j + 0.5, isSpawn: true });
        }

        // Right spawn
        for (let j = levelWidth - spawnWidth + 1; j < levelWidth + 1; j++) {
            result.push({ row: 4, column: j - 1.5, isSpawn: true });
        }

        // Top left
        for (let j = 2; j < 6; j++) {
            result.push({ row: 0, column: j, isSpawn: false });
        }
        
        // Top right
        for (let j = 12; j < 16; j++) {
            result.push({ row: 0, column: j, isSpawn: false });
        }

        // Randomized platforms
        for (let i = 1; i < 4; i++) {
            const maxPlatformWidth = 7;
            const minPlatformWidth = 2;
            const maxGapWidth = 2;
            const minGapWidth = 1;

            let curr = [];
            while (curr.length < levelWidth) {
                // 50% of the time, choose to start the level with a gap
                if (curr.length == 0 && game.rnd.integerInRange(0, 1) == 1) {
                    for (var j = 0; j < game.rnd.integerInRange(0, maxGapWidth); j++) {
                        curr.push(false);
                    }
                } else {
                    for (let j = 0; j < game.rnd.integerInRange(minPlatformWidth, maxPlatformWidth); j++) {
                        curr.push(true);
                    }
                    for (let j = 0; j < game.rnd.integerInRange(minGapWidth, maxGapWidth); j++) {
                        curr.push(false);
                    }
                }
            }
            curr = curr.slice(0, levelWidth);
            
            // Since we can run past the max level width, slicing off the extra can result in a 
            // 1-width platform at the end of the level. In this case, make sure it's at least 
            // length 2
            if (curr[levelWidth - 1] && !curr[levelWidth - 2]) {
                curr[levelWidth - 2] = true;
            }

            const temp = curr.map((value, index) => ({ value, index }))
                .filter(item => item.value)
                .map(item => ({ row: i, column: item.index, isSpawn: false }));
            
            result = result.concat(temp);
        }

        return result;
    }

    const generateRopes = (platforms) => {
        const result = [];

        // Fixed top ropes
        result.push({ column: 3.5, row: 0, length: 5 });
        result.push({ column: 13.5, row: 0, length: 5 });

        const leftRopes = [];
        const otherRopes = [];

        const isPlatform = (column, row) => (platforms.filter(p => p.row == row && p.column == column).length > 0)


        for (let i = 1; i < 18; i++) {
            const options = [];
            if (isPlatform(i, 1) && isPlatform(i, 2)) {
                options.push({ column: i, row: 1, length: 2 });
            }
            if (isPlatform(i, 2) && isPlatform(i, 3)) {
                options.push({ column: i, row: 2, length: 2 });
            }
            if (isPlatform(i, 1) && isPlatform(i, 3)) {
                options.push({ column: i, row: 1, length: 3 });
            }

            if (options.length > 0) {
                const item = Phaser.ArrayUtils.getRandomItem(options);

                if (i < 4) {
                    leftRopes.push(item)
                } else if (i > 4 && i != 14) {
                    otherRopes.push(item);
                }
            }
        }

        if (leftRopes.length > 0) {
            result.push(Phaser.ArrayUtils.getRandomItem(leftRopes));
        }

        if (otherRopes.length > 0) {
            // Hard max of other ropes is 4
            const max = Math.min(otherRopes.length, Math.floor(Math.random() * 3) + 1);

            let count = 0;
            while (count < max && otherRopes.length > 0) {
                result.push(Phaser.ArrayUtils.removeRandomItem(otherRopes));
           
                count++;
           }   
        }

        return result;
    }

    function render() {

    }

    MarshmallowDuel.Game = {preload: preload, create: create, update: update, render: render};
})();