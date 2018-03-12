export class GameManager {
    constructor() {}

    killPlayer(player, deathType) {
        console.log(`Player ${player.id} died with death type ${deathType}`);
    }

    warpPlayer(player) {
        const x = Math.random() * game.world.width;
        const y = Math.random() * game.world.height * 0.57;
        player.x = x;
        player.y = y;
        this.ammo = 0;
    }
}
