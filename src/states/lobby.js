import Keyboard from "../game/Player/keyboard";
import Gamepad from "../game/Player/gamepad";
import { removeAtIndex, debugRender } from "../game/util";
import { addAnimations } from "../game/Player/animations";
import { animations } from "../enums/animations";

let inputs;

const skins = ["player1", "player2", "player3"];

const players = [];

function init() {
    inputs = [
        new Keyboard(1),
        new Keyboard(2),
        new Keyboard(3),
        new Keyboard(4),
        new Gamepad(1),
        new Gamepad(2),
        new Gamepad(3),
        new Gamepad(4)
    ];
}

function create() {
    // TODO: Set up UI elements

    for (let i = 0; i < 12; i++) {
        const item = new LobbyItem(i, (i + 1) * 50, 200);

        //item.enabled = i % 2 == 0;
    }
}

function render() {}

function update() {
    players.forEach(player => {
        const input = player.input.getInput(true);

        if (input.nf && !player.ready) {
            player.sprite.animations.play(animations.VICTORY_FLEX);
            player.ready = true;
        }

        if (input.nb) {
            if (player.ready) {
                player.sprite.animations.play(animations.STAND);
                player.ready = false;
            } else {
                removePlayer(player);
            }
        }
    });

    pollForNewPlayers();
}

function pollForNewPlayers() {
    for (let i = inputs.length - 1; i >= 0; i--) {
        const input = inputs[i];

        if (input.getInput(true).nf) {
            removeAtIndex(inputs, i);

            addPlayer(input);
        }
    }
}

function addPlayer(input) {
    const id = players.length;

    const x = (id + 1) * 100;
    const y = 100;

    const player = new LobbyPlayer(id, skins[id], input, x, y);

    players.push(player);
}

function removePlayer(player) {
    const index = players.indexOf(player);

    inputs.push(player.input);
    removeAtIndex(players, index);

    player.sprite.kill();

    for (let i = index; i < players.length; i++) {
        players[i].sprite.x = (index + 1) * 100;
    }
}

class LobbyPlayer {
    constructor(id, skin, input, x, y) {
        this.id = id;
        this.skin = skin;
        this.input = input;

        this.sprite = game.add.sprite(x, y, skin);
        this.sprite.anchor.setTo(0.5);

        addAnimations(this.sprite);
    }
}

class LobbyItem {
    constructor(type, x, y) {
        this.sprite = game.add.sprite(x, y, "items");
        // sprite.animations.add("default", [0, 1, 2], 4, true);
        // sprite.animations.play("default");
        this.sprite.anchor.setTo(0.5);

        this.disabledSprite = game.add.sprite(0, 0, "items_grayscale");
        this.disabledSprite.anchor.setTo(0.5);
        this.sprite.addChild(this.disabledSprite);

        this.icon = game.add.sprite(0, 0, "items");
        this.icon.frame = type + 3;
        this.icon.anchor.setTo(0.5);
        this.sprite.addChild(this.icon);

        this.disabledIcon = game.add.sprite(0, 0, "items_grayscale");
        this.disabledIcon.frame = type + 3;
        this.disabledIcon.anchor.setTo(0.5);
        this.disabledSprite.addChild(this.disabledIcon);

        this.enabled = true;
    }

    set enabled(value) {
        this.icon.visible = value;
        this.disabledSprite.visible = !value;
    }
}

export default { init, create, update, render };
