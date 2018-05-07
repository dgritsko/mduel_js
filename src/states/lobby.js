import Keyboard from "../game/Player/keyboard";
import Gamepad from "../game/Player/gamepad";
import { removeAtIndex } from "../game/util";

let inputs;

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

            console.log("added new player!");
        }
    }
}

export default { init, create, update, render };
