import cfg from '../../gameConfig';
import { locations } from '../../player';

const handlePlayerCollisions = (player) => {
    // TODO

    // const player1 = players[0];
    // const player2 = players[1];

    // player1.sprite.data.index = 0;
    // player2.sprite.data.index = 1;

    // const hitPlayer = game.physics.arcade.overlap(player1.sprite, player2.sprite, (p1, p2) => {
    // }, (p1, p2) => {
    //     const getLocation = p => players[p.data.index].location;
    //     const currentLocations = [getLocation(p1), getLocation(p2)];
        
    //     const checkLocations = (location1, location2) => {
    //         return (currentLocations[0] === location1 && currentLocations[1] === location2) || (currentLocations[1] === location1 && currentLocations[0] === location2);
    //     }

    //     const checkDirection = (player, direction) => {
    //         switch (direction) {
    //             case 'left':
    //                 return player.sprite.body.velocity.x < 0;
    //                 break;
    //             case 'right':
    //             return player.sprite.body.velocity.x > 0;
    //                 break;
    //             default:
    //                 return true;
    //                 break;
    //         }
    //     }

    //     const knockBack = (player, direction) => {
    //         player.sprite.body.velocity.y = -200;
    //         switch (direction) {
    //             case 'left':
    //                 player.sprite.body.velocity.x = -200;
    //                 break;
    //             case 'right':
    //                 player.sprite.body.velocity.x = 200;
    //                 break;
    //             default:
    //                 player.sprite.body.velocity.x = 0;
    //                 break;
    //         }
    //     }

    //     const halt = player => {
    //         player.sprite.body.velocity.x = 0;
    //     }

    //     if (checkLocations(locations.PLATFORM, locations.PLATFORM)) {
    //         if (checkDirection(player1, 'left') && checkDirection(player2, 'right')) {
    //             knockBack(player1, 'right');
    //             knockBack(player2, 'left');
    //             return true;
    //         }

    //         if (checkDirection(player2, 'left') && checkDirection(player1, 'right')) {
    //             knockBack(player2, 'right');
    //             knockBack(player1, 'left');
    //             return true;
    //         }

    //         if (checkDirection(player1, 'left') && checkDirection(player2, 'none')) {
    //             knockBack(player2, 'left');
    //             halt(player1);
    //             return true;
    //         }

    //         if (checkDirection(player1, 'right') && checkDirection(player2, 'none')) {
    //             knockBack(player2, 'right');
    //             halt(player1);
    //             return true;
    //         }

    //         if (checkDirection(player2, 'left') && checkDirection(player1, 'none')) {
    //             knockBack(player1, 'left');
    //             halt(player2);
    //             return true;
    //         }

    //         if (checkDirection(player2, 'right') && checkDirection(player1, 'none')) {
    //             knockBack(player1, 'right');
    //             halt(player2);
    //             return true;
    //         }
    //     } else if (checkLocations(locations.ROPE, locations.ROPE)) {
    //         if ((p1.body.velocity.y * p2.body.velocity.y) <= 0) {
    //             // TODO
    //         }
    //     } else if (checkLocations(locations.AIR, locations.AIR)) {

    //     } else if (checkLocations(locations.PLATFORM, locations.AIR)) {

    //     } else if (checkLocations(locations.PLATFORM, locations.ROPE)) {

    //     } else if (checkLocations(locations.AIR, locations.ROPE)) {

    //     } 

    //     return false;
    // });
}

export { handlePlayerCollisions };