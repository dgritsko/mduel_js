import cfg from '../gameConfig';
import { locations, Player } from '../player';

let level;
const players = [];

function createPlayerInput(playerId) {
    if (playerId === 1) {
        return game.input.keyboard.createCursorKeys();
    } else {
        return {
            up: game.input.keyboard.addKey(Phaser.Keyboard.I),
            down: game.input.keyboard.addKey(Phaser.Keyboard.K),
            left: game.input.keyboard.addKey(Phaser.Keyboard.J),
            right: game.input.keyboard.addKey(Phaser.Keyboard.L)
        }
    }
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = cfg.gravity;

    level = makeLevel();
    
    // const player1 = new Player('player1', 100, 100);
    // const player2 = new Player('player2', game.world.width - 100, 100);
    const player1 = new Player('player1', 60, 300);
    const player2 = new Player('player2', 160, 300);

    player1.input = createPlayerInput(1);
    player2.input = createPlayerInput(2);

    players.push(player1);
    players.push(player2);
}

function update() {
    const apply = (attr) => p => {
        if (attr.animation) {
            p.sprite.animations.play(attr.animation);
        } else {
            p.sprite.animations.stop();
        }

        if (attr.direction === 'left') {
            p.sprite.scale.setTo(-1, 1);
        } else if (attr.direction === 'right') {
            p.sprite.scale.setTo(1, 1);
        }

        if (typeof(attr.xVel) !== 'undefined') {
            p.sprite.body.velocity.x = attr.xVel;
        }

        if (typeof(attr.yVel) !== 'undefined') {
            p.sprite.body.velocity.y = attr.yVel;
        }

        if (typeof(attr.yAdjustment) !== 'undefined') {
            p.sprite.y = p.sprite.y + attr.yAdjustment;
        }

        if (typeof(attr.location) !== 'undefined') {
            p.location = attr.location;
        }

        if (attr.onRope) {
            p.sprite.body.moves = false;

            if (p.rope) {
                p.sprite.y = Math.max(p.sprite.y, p.rope.top.y + p.sprite.offsetY - 8);
                p.sprite.y = Math.min(p.sprite.y, p.rope.bottom.y - p.sprite.offsetY);
            }
        } else {
            p.sprite.body.moves = true;
        }
    };

    let behaviors = [
        {
            match: { up: true, location: locations.ROPE },
            act: apply({ animation: 'climb', onRope: true, yAdjustment: -cfg.climbRate })
        },
        {
            match: { down: true, location: locations.ROPE },
            act: apply({ animation: 'climb', onRope: true, yAdjustment: cfg.climbRate })
        },
        {
            match: { right: true, location: locations.ROPE },
            act: apply({ animation: 'stand_fall', location: locations.AIR, xVel: cfg.runSpeed, direction: 'right' })
        },
        {
            match: { left: true, location: locations.ROPE },
            act: apply({ animation: 'stand_fall', location: locations.AIR, xVel: -cfg.runSpeed, direction: 'left' })
        },
        {
            match: { location: locations.ROPE },
            act:
                p => {
                    p.sprite.animations.stop();
                }
        },
        {  
            match: { up: true, left: true, location: locations.PLATFORM },
            act: apply({ animation: 'run_jump', direction: 'left', xVel: -cfg.runSpeed, yVel: -cfg.jumpSpeed, location: locations.AIR })
        },
        {  
            match: { up: true, right: true, location: locations.PLATFORM },
            act: apply({ animation: 'run_jump', direction: 'right', xVel: cfg.runSpeed, yVel: -cfg.jumpSpeed, location: locations.AIR })
        },
        { 
            match: { left: true, location: locations.PLATFORM },
            act: apply({ animation: 'run', direction: 'left', xVel: -cfg.runSpeed })
        },
        { 
            match: { right: true, location: locations.PLATFORM }, 
            act: apply({ animation: 'run', direction: 'right', xVel: cfg.runSpeed })
        },
        {
            match: { down: true, left: true, location: locations.PLATFORM, xVel: -cfg.runSpeed },
            act: 
                p => {
                    const name = 'roll';

                    if (p.sprite.animations.currentAnim.name !== name) {
                        p.sprite.animations.play(name);
                    } else if (p.sprite.animations.currentAnim.isFinished) {
                        p.sprite.body.velocity.x = 0;
                    }
                }
        },
        {
            match: { down: true, right: true, location: locations.PLATFORM, xVel: cfg.runSpeed },
            act: 
                p => {
                    const name = 'roll';

                    if (p.sprite.animations.currentAnim.name !== name) {
                        p.sprite.animations.play(name);
                    } else if (p.sprite.animations.currentAnim.isFinished) {
                        p.sprite.body.velocity.x = 0;
                    }
                }
        },
        {
            match: { up: true, location: locations.PLATFORM },
            act:
                p => {
                    const x = p.sprite.x;
                    const y = p.sprite.y + p.sprite.offsetY;
                    const ropes = level.ropes.filter(r => (r.x >= (x - cfg.ropeDist) && r.x <= (x + cfg.ropeDist))).filter(r => (y >= r.y && y <= (r.y + r.height + cfg.ropeDist)));

                    if (ropes.length > 0) {
                        p.location = locations.ROPE;
                        p.sprite.x = ropes[0].x;
                        p.rope = { top: new Phaser.Point(ropes[0].x, ropes[0].y), bottom: new Phaser.Point(ropes[0].x, ropes[0].y + ropes[0].height) };
                    } else {
                        apply({ yVel: -cfg.jumpSpeed, animation: 'jump', location: locations.AIR })(p);
                    }
                }
        },
        {
            match: { down: true, location: locations.PLATFORM, xVel: 0 },
            act:
                p => {
                    const x = p.sprite.x;
                    const y = p.sprite.y + p.sprite.offsetY;
                    const ropes = level.ropes.filter(r => (r.x >= (x - cfg.ropeDist) && r.x <= (x + cfg.ropeDist))).filter(r => (y >= r.y && y <= (r.y + r.height + cfg.ropeDist)));

                    if (ropes.length > 0) {
                        p.location = locations.ROPE;
                        p.sprite.x = ropes[0].x;
                        p.rope = { top: new Phaser.Point(ropes[0].x, ropes[0].y), bottom: new Phaser.Point(ropes[0].x, ropes[0].y + ropes[0].height) };
                    } else {
                        const name = 'crouch';

                        if (p.sprite.animations.currentAnim.name !== name) {
                            p.sprite.animations.play(name);
                        } else if (p.sprite.animations.currentAnim.isFinished) {
                            p.sprite.body.velocity.x = 0;
                        }
                    }
                }
        },
        { 
            match: { location: locations.PLATFORM },
            act: apply({ animation: 'stand', xVel: 0 })
        }
    ];

    const player1 = players[0];
    const player2 = players[1];

    player1.sprite.data.index = 0;
    player2.sprite.data.index = 1;

    const hitPlayer = game.physics.arcade.overlap(player1.sprite, player2.sprite, (p1, p2) => {
    }, (p1, p2) => {
        const getLocation = p => players[p.data.index].location;
        const currentLocations = [getLocation(p1), getLocation(p2)];
        
        const checkLocations = (location1, location2) => {
            return (currentLocations[0] === location1 && currentLocations[1] === location2) || (currentLocations[1] === location1 && currentLocations[0] === location2);
        }

        const checkDirection = (player, direction) => {
            switch (direction) {
                case 'left':
                    return player.sprite.body.velocity.x < 0;
                    break;
                case 'right':
                return player.sprite.body.velocity.x > 0;
                    break;
                default:
                    return true;
                    break;
            }
        }

        const knockBack = (player, direction) => {
            player.sprite.body.velocity.y = -200;
            switch (direction) {
                case 'left':
                    player.sprite.body.velocity.x = -200;
                    break;
                case 'right':
                    player.sprite.body.velocity.x = 200;
                    break;
                default:
                    player.sprite.body.velocity.x = 0;
                    break;
            }
        }

        const halt = player => {
            player.sprite.body.velocity.x = 0;
        }

        if (checkLocations(locations.PLATFORM, locations.PLATFORM)) {
            if (checkDirection(player1, 'left') && checkDirection(player2, 'right')) {
                knockBack(player1, 'right');
                knockBack(player2, 'left');
                return true;
            }

            if (checkDirection(player2, 'left') && checkDirection(player1, 'right')) {
                knockBack(player2, 'right');
                knockBack(player1, 'left');
                return true;
            }

            if (checkDirection(player1, 'left') && checkDirection(player2, 'none')) {
                knockBack(player2, 'left');
                halt(player1);
                return true;
            }

            if (checkDirection(player1, 'right') && checkDirection(player2, 'none')) {
                knockBack(player2, 'right');
                halt(player1);
                return true;
            }

            if (checkDirection(player2, 'left') && checkDirection(player1, 'none')) {
                knockBack(player1, 'left');
                halt(player2);
                return true;
            }

            if (checkDirection(player2, 'right') && checkDirection(player1, 'none')) {
                knockBack(player1, 'right');
                halt(player2);
                return true;
            }
        } else if (checkLocations(locations.ROPE, locations.ROPE)) {
            if ((p1.body.velocity.y * p2.body.velocity.y) <= 0) {
                // TODO
            }
        } else if (checkLocations(locations.AIR, locations.AIR)) {

        } else if (checkLocations(locations.PLATFORM, locations.AIR)) {

        } else if (checkLocations(locations.PLATFORM, locations.ROPE)) {

        } else if (checkLocations(locations.AIR, locations.ROPE)) {

        } 

        return false;
    });

    if (hitPlayer) {
        return;
    }

    players.forEach(player => {
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
                    player.sprite.animations.play('stand_fall');
                    player.location = locations.AIR;
                    break;
                case locations.AIR:
                    if ((player.sprite.x + (player.sprite.offsetX / 2)) <= 0) {
                        player.sprite.body.velocity.x = Math.abs(player.sprite.body.velocity.x);
                    } else if ((player.sprite.x + (player.sprite.offsetX / 2)) >= game.world.width) {
                        player.sprite.body.velocity.x = -Math.abs(player.sprite.body.velocity.x);
                    }

                    if (player.sprite.y > 500) {
                        // TODO: FIDS
                        player.sprite.y -= 500;
                    }
                    break;
            }
        }

        const curr = { 
            left: player.input.left.isDown,
            right: player.input.right.isDown,
            up: player.input.up.isDown,
            down: player.input.down.isDown,
            location: player.location,
            xVel: player.sprite.body.velocity.x
        };

        let bestMatch = null;
        let bestScore = 0;
        let bestMatchIndex = -1;

        for (let i = 0; i < behaviors.length; i++) {
            const behavior = behaviors[i];

            let isMatch = true;
            let matchScore = 0;

            const checkProps = x => {
                if (typeof(behavior.match[x]) === 'undefined') {
                    return;
                } 
                
                if (behavior.match[x] !== curr[x]) {
                    isMatch = false;
                } else {
                    matchScore++;
                }
            };

            checkProps('left');
            checkProps('right');
            checkProps('up');
            checkProps('down');
            checkProps('location');
            checkProps('xVel');

            if (isMatch && bestScore < matchScore) {
                bestScore = matchScore;
                bestMatch = behavior;
                bestMatchIndex = i;
            }
        }

        if (bestMatch) {
            bestMatch.act(player);
            //console.log(`Behavior ${bestMatchIndex}`);
        }
    });
    
    //game.debug.text(player1.sprite.animations, 2, 14, '#ff0000');
    //game.debug.body(player1.sprite);
}

function makeLevel() {
    const { verticalSpacing, verticalOffset, horizontalSpacing, horizontalOffset } = cfg;

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
        const mallowSurface = game.add.sprite(j * horizontalSpacing, game.world.height - (horizontalSpacing * 1.75), 'mallow_surface');
        mallowSurface.animations.add('default', [j % 4, (j + 1) % 4, (j + 2) % 4, (j + 3) % 4], 0.25, true);
        mallowSurface.animations.play('default');
        marshmallows.add(mallowSurface);

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

    const { verticalSpacing, verticalOffset, horizontalSpacing, horizontalOffset } = cfg;

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

export default {create: create, update: update, render: render};