import cfg from '../gameConfig';
import { locations, Player } from '../player';
import { makeLevel } from '../gameutil/level';
import { handleMovement } from './game.movement';

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

        handleMovement(player, level);
    });
    
    //game.debug.text(player1.sprite.animations, 2, 14, '#ff0000');
    //game.debug.body(player1.sprite);
}

export default {create: create, update: update};