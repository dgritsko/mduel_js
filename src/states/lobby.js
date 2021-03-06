import { removeAtIndex, dist } from "../game/util";
import { animations } from "../enums/animations";
import { sortBy } from "ramda";
import { items as itemsEnum } from "../enums/items";
import { NameInput, LobbyItem, LobbyPlayer } from "../lobby";
import { setupInput } from "../game/Player/inputUtil";
import { gameStates } from "../enums/gameStates";
import { buildConfig } from "../lobby/buildConfig";
import { prop } from "ramda";

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

function init(data) {
    if (prop("default", data)) {
        startGame(true);
        return;
    }

    const createInput = i => ({
        assigned: false,
        controls: setupInput(i),
        inputIdentifier: i
    });

    inputs = [
        createInput("k1"),
        createInput("k2"),
        createInput("k3"),
        createInput("k4"),
        createInput("g1"),
        createInput("g2"),
        createInput("g3"),
        createInput("g4")
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

    cursor = game.add.sprite(50, 50, "arrow");
    cursor.anchor.setTo(0.5);
}

function highlightLocation(location) {
    if (cursorLocation && cursorLocations[cursorLocation].highlight) {
        cursorLocation[cursorLocations.highlight(false)];
    }

    if (cursorLocations[location].highlight) {
        cursorLocation[location].highlight(true);
    }

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
        const makeF = (m, b) => x => m * x + b;
        const makeB = (m, x, y) => y - m * x;
        const make = (m, { x, y }) => makeF(m, makeB(m, x, y));

        // const drawLine = (x1, y1, x2, y2) => {
        //     const line = new Phaser.Line(x1, y1, x2, y2);
        //     const graphics = game.add.graphics(0, 0);
        //     graphics.lineStyle(1, 0x00ff00, 1);
        //     graphics.moveTo(line.start.x, line.start.y);
        //     graphics.lineTo(line.end.x, line.end.y);
        //     graphics.endFill();
        // };
        // const draw = (f, { x }) =>
        //     drawLine(x - 100, f(x - 100), x + 100, f(x + 100));
        // const everything = (m, i) => {
        //     draw(make(m, cursorLocations[i]), cursorLocations[i]);
        //     draw(make(-m, cursorLocations[i]), cursorLocations[i]);
        // };

        const pick = (pred, modified) => {
            const { x, y } = cursorLocations[cursorLocation];

            const filtered = cursorLocations.filter(l => pred(l, x, y));

            return filtered.length === 0 ? modified(x, y) : { x, y };
        };

        const moveToNextLocation = (m, pred, loc) => {
            const f1 = make(m, loc);
            const f2 = make(-m, loc);

            const locations = cursorLocations.filter(l => pred(l, f1, f2));

            const sorted = sortBy(
                other => dist([loc.x, loc.y], [other.x, other.y]),
                locations
            );
            const index =
                sorted.length === 0
                    ? cursorLocations.length - 1
                    : cursorLocations.indexOf(sorted[0]);
            highlightLocation(index);
        };

        switch (key) {
            case "up": {
                const loc = pick(
                    (l, x, y) => l.y < y,
                    (x, y) => ({ x, y: game.world.height })
                );

                moveToNextLocation(
                    2,
                    (l, f1, f2) => l.y < f1(l.x) && l.y < f2(l.x),
                    loc
                );
                break;
            }
            case "down": {
                const loc = pick((l, x, y) => l.y > y, (x, y) => ({ x, y: 0 }));

                moveToNextLocation(
                    -2,
                    (l, f1, f2) => l.y > f1(l.x) && l.y > f2(l.x),
                    loc
                );
                break;
            }
            case "left": {
                const loc = pick(
                    (l, x, y) => l.x < x,
                    (x, y) => ({ x: game.world.width, y })
                );

                moveToNextLocation(
                    -0.5,
                    (l, f1, f2) => l.y < f1(l.x) && l.y > f2(l.x),
                    loc
                );
                break;
            }
            case "right": {
                const loc = pick((l, x, y) => l.x > x, (x, y) => ({ x: 0, y }));

                moveToNextLocation(
                    0.5,
                    (l, f1, f2) => l.y < f1(l.x) && l.y > f2(l.x),
                    loc
                );
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

    const createSelectableText = (x, y, text, action) => {
        const label = makeLabel(x, y, text);
        label.anchor.setTo(0.5);
        cursorLocations.push({
            x: label.x,
            y: label.y,
            action
        });
    };

    createSelectableText(game.world.width - 100, 160, "Basic", () =>
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
    );

    createSelectableText(game.world.width - 100, 220, "Full", () =>
        setItems(new Set(Object.values(itemsEnum)))
    );

    createSelectableText(game.world.width - 100, 280, "None", () =>
        setItems(new Set())
    );

    createSelectableText(game.world.centerX, 380, "Start Game", () =>
        startGame()
    );

    createSelectableText(100, 20, "FFA", () => {
        console.log("TODO: Setup FFA mode");
    });

    createSelectableText(200, 20, "Teams", () => {
        console.log("TODO: Setup Teams mode");
    });

    highlightLocation(0);
}

function startGame(useDefaultConfig) {
    const customConfig = {};

    if (!useDefaultConfig) {
        if (players.length === 0) {
            return;
        }

        const availableItems = items
            .filter(item => item.enabled)
            .map(item => item.type);

        customConfig.items = {
            availableItems
        };

        const configPlayers = players.map((player, i) => ({
            name: player.name,
            sprite: player.sprite.key,
            id: player.id,
            teamId: i + 1, // TODO
            inputId: player.input.inputIdentifier
        }));

        customConfig.players = configPlayers;
    }

    game.state.start(gameStates.GAME, true, false, buildConfig(customConfig));
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
