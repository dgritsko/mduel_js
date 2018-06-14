import Keyboard from "../game/Player/keyboard";
import Gamepad from "../game/Player/gamepad";
import { removeAtIndex, dist } from "../game/util";
import { animations } from "../enums/animations";
import { sortBy } from "ramda";
import { items as itemsEnum } from "../enums/items";
import { NameInput, LobbyItem, LobbyPlayer } from "../lobby";

let inputs;

const skins = ["player1", "player2", "player3"];

const players = [];

const items = [];

let cursor;

const states = {
    DEFAULT: "default",
    NAME_INPUT: "name_input"
};

let state = states.DEFAULT;

let cursorLocation = 0;
const cursorLocations = [];

let nameInput;

const PLAYER_START_X = 100;
const PLAYER_DIST_X = 100;
const PLAYER_START_Y = 80;
const ITEM_START_X = 100;
const ITEM_DIST_X = 110;
const ITEM_START_Y = 160;
const ITEM_DIST_Y = 70;

function init() {
    const createInput = i => ({ assigned: false, controls: i });

    inputs = [
        createInput(new Keyboard(1)),
        createInput(new Keyboard(2)),
        createInput(new Keyboard(3)),
        createInput(new Keyboard(4)),
        createInput(new Gamepad(1)),
        createInput(new Gamepad(2)),
        createInput(new Gamepad(3)),
        createInput(new Gamepad(4))
    ];

    const keys = game.input.keyboard.createCursorKeys();
    const esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    const enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    keys.up.onDown.add(() => menuAction("up"));
    keys.down.onDown.add(() => menuAction("down"));
    keys.left.onDown.add(() => menuAction("left"));
    keys.right.onDown.add(() => menuAction("right"));
    enter.onDown.add(() => menuAction("select"));
    esc.onDown.add(() => menuAction("esc"));

    cursor = game.add.sprite(50, 50, "items");
    cursor.anchor.setTo(0.5);
}

function moveCursor(location) {
    cursorLocation = location;
    cursor.x = cursorLocations[location].x;
    cursor.y = cursorLocations[location].y;
}

function menuAction(key) {
    if (state === states.NAME_INPUT) {
        switch (key) {
            case "select": {
                players[players.length - 1].name = nameInput.value;
                nameInput.destroy();
                state = states.DEFAULT;
                break;
            }
            case "esc": {
                nameInput.destroy();
                removePlayer(players[players.length - 1]);
                state = states.DEFAULT;
                break;
            }
            default:
                break;
        }
    } else if (state === states.DEFAULT) {
        switch (key) {
            case "up": {
                const currX = cursorLocations[cursorLocation].x;
                const currY = cursorLocations[cursorLocation].y;
                const locations = cursorLocations.filter(
                    l => l.x <= currX && l.y < currY
                );

                const sorted = sortBy(
                    other => dist([currX, currY], [other.x, other.y]),
                    locations
                );
                const index =
                    sorted.length === 0
                        ? cursorLocations.length - 1
                        : cursorLocations.indexOf(sorted[0]);
                moveCursor(index);
                break;
            }
            case "down": {
                const currX = cursorLocations[cursorLocation].x;
                const currY = cursorLocations[cursorLocation].y;
                const locations = cursorLocations.filter(
                    l => l.x >= currX && l.y > currY
                );

                const sorted = sortBy(
                    other => dist([currX, currY], [other.x, other.y]),
                    locations
                );
                const index =
                    sorted.length === 0
                        ? 0
                        : cursorLocations.indexOf(sorted[0]);
                moveCursor(index);
                break;
            }
            case "left": {
                const index = cursorLocation - 1;
                moveCursor(index === -1 ? cursorLocations.length - 1 : index);
                break;
            }
            case "right": {
                const index = cursorLocation + 1;
                moveCursor(index === cursorLocations.length ? 0 : index);
                break;
            }
            case "select": {
                const location = cursorLocations[cursorLocation];
                location.action();
                break;
            }
            case "esc": {
                const location = cursorLocations[cursorLocation];
                location.cancel && location.cancel();
                break;
            }
        }
    }
}

function setItems(activeItems) {
    Object.values(itemsEnum).forEach(type => {
        const enabled = activeItems.has(type);

        const item = items.filter(i => i.type === type);
        if (item.length === 1) {
            item[0].enabled = enabled;
        }
    });
}

function create() {
    // TODO: Set up UI elements

    const CURSOR_LOCATION_X_OFFSET = 0;
    const CURSOR_LOCATION_Y_OFFSET = 30;

    for (let i = 0; i < 12; i++) {
        const x = ITEM_START_X + (i % 4) * ITEM_DIST_X;
        const y = ITEM_START_Y + Math.floor(i / 4) * ITEM_DIST_Y;
        const item = new LobbyItem(i, x, y);

        items.push(item);

        cursorLocations.push({
            x: x + CURSOR_LOCATION_X_OFFSET,
            y: y + CURSOR_LOCATION_Y_OFFSET,
            action: () => {
                item.enabled = !item.enabled;
            }
        });
    }

    const makeLabel = (x, y, text) =>
        game.add.bitmapText(x, y, "mduel-menu", text, 16);

    const basicLabel = makeLabel(game.world.width - 100, 160, "Basic");
    const fullLabel = makeLabel(game.world.width - 100, 220, "Full");
    const noneLabel = makeLabel(game.world.width - 100, 280, "None");

    cursorLocations.push({
        x: basicLabel.x,
        y: basicLabel.y,
        action: () =>
            setItems(
                new Set([
                    itemsEnum.DEATH,
                    itemsEnum.VOLTS,
                    itemsEnum.INVISIBILITY,
                    itemsEnum.MINE,
                    itemsEnum.GUN,
                    itemsEnum.TNT
                ])
            )
    });

    cursorLocations.push({
        x: fullLabel.x,
        y: fullLabel.y,
        action: () => setItems(new Set(Object.values(itemsEnum)))
    });

    cursorLocations.push({
        x: noneLabel.x,
        y: noneLabel.y,
        action: () => setItems(new Set())
    });

    const startLabel = makeLabel(game.world.centerX, 380, "Start Game");
    startLabel.anchor.setTo(0.5);

    cursorLocations.push({
        x: startLabel.x,
        y: startLabel.y,
        action: () => startGame()
    });

    moveCursor(0);
}

function startGame() {
    console.log("TODO: Start game");
}

function render() {}

function update() {
    switch (state) {
        case states.NAME_INPUT:
            break;
        default:
            players.forEach(player => {
                const input = player.input.controls.getInput(true);

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
            break;
    }
}

function pollForNewPlayers() {
    const toAdd = inputs.filter(
        input => !input.assigned && input.controls.getInput(true).nf
    );

    if (toAdd.length === 0) {
        return;
    }

    state = states.NAME_INPUT;

    const activeInput = toAdd[0];

    activeInput.assigned = true;
    addPlayer(activeInput);
}

function addPlayer(input) {
    nameInput = new NameInput(game.world.centerX, game.world.centerY);
    nameInput.focused = true;

    const id = players.length;

    const x = PLAYER_START_X + id * PLAYER_DIST_X;
    const y = PLAYER_START_Y;

    const player = new LobbyPlayer(id, skins[id], input, x, y);

    players.push(player);
}

function removePlayer(player) {
    const index = players.indexOf(player);

    player.input.assigned = false;

    removeAtIndex(players, index);

    player.sprite.kill();

    for (let i = index; i < players.length; i++) {
        players[i].sprite.x = (index + 1) * PLAYER_DIST_X;
    }
}

export default { init, create, update, render };
