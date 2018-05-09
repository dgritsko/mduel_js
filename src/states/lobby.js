import Keyboard from "../game/Player/keyboard";
import Gamepad from "../game/Player/gamepad";
import { removeAtIndex } from "../game/util";

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
}

function render() {}

function update() {
    pollForNewPlayers();
}

function pollForNewPlayers() {
    for (let i = inputs.length - 1; i >= 0; i--) {
        const input = inputs[i];

        if (input.getRawInput().fire) {
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

class LobbyPlayer {
    constructor(id, skin, input, x, y) {
        this.id = id;
        this.skin = skin;
        this.input = input;

        this.sprite = game.add.sprite(x, y, skin);
        this.sprite.anchor.setTo(0.5);
    }
}

export default { init, create, update, render };
