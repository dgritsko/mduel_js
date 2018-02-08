class PlayerSnapshot {
    constructor(player) {
        this.player = player;
        this.state = Object.assign({}, player.getState(), player.getInput());
    }

    update(toUpdate) {
        this.player.update(toUpdate);
        this.state = Object.assign(
            {},
            this.player.getState(),
            this.player.getInput()
        );
    }
}

export { PlayerSnapshot };
