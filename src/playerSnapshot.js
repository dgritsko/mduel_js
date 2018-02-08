class PlayerSnapshot {
    constructor(player) {
        this.player = player;
        this.state = Object.assign({}, player.getState(), player.getInput());
    }
}

export { PlayerSnapshot };
