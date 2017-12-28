(function() {
    function preload() {
        // TODO: Load assets

        game.load.spritesheet('player1', 'assets/player1.png', 64, 64);
    }

    function create() {
        var scaleMode = MarshmallowDuel.fullscreen ? Phaser.ScaleManager.SHOW_ALL : Phaser.ScaleManager.NONE;

        game.scale.scaleMode = scaleMode;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.state.start('Game');
    }

    MarshmallowDuel.Boot = {preload: preload, create: create};
})();