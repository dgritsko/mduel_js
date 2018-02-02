import cfg from '../../gameConfig';
import { locations, Player } from '../../player';
import { makeLevel } from '../../gameutil/level';
import { handlePlayerMovement } from './playerMovement';
import { handlePlatformCollisions } from './platformCollisions';
import { handlePlayerCollisions } from './playerCollisions';
import { handleItemCollisions } from './itemCollisions'
import { handleLevelCollisions } from './levelCollisions';
import { handleItemUsage } from './itemUsage';
import { handlePowerupCollisions } from './powerupCollisions';

let level;
const players = [];

function create() {
    game.stage.disableVisibilityChange = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = cfg.gravity;

    level = makeLevel();
    
    // const player1 = new Player('player1', 100, 100);
    // const player2 = new Player('player2', game.world.width - 100, 100);
    const player1 = new Player('player1', 60, 300, 1);
    const player2 = new Player('player2', 160, 300, 2);

    players.push(player1);
    players.push(player2);
}

function update() {
    // each player:
    // 1. collide with platforms.
    // 2. collide with other players
    // 3. collide with items
    // 4. collide with powerups
    // 5. collide with pit
    // 6. collide with walls

    // then, if input enabled and on rope or platform:
    // 1. handle input appropriately
    // 2. if no input, then use default behavior for rope or platform

    // handle item usage on action keypress (NOT if key was pressed prior to this)

    players.forEach(player => {
        handlePlatformCollisions(player, level);

        handlePlayerCollisions(player);

        handleItemCollisions(player);

        handlePowerupCollisions(player);

        handleLevelCollisions(player);

        handleItemUsage(player);

        handlePlayerMovement(player, level);
    });
    
    //game.debug.text(player1.sprite.animations, 2, 14, '#ff0000');
    //game.debug.body(player1.sprite);
}

export default {create: create, update: update};