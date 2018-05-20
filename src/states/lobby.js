import Keyboard from "../game/Player/keyboard";
import Gamepad from "../game/Player/gamepad";
import { removeAtIndex, debugRender, dist } from "../game/util";
import { addAnimations } from "../game/Player/animations";
import { animations } from "../enums/animations";
import { sortBy } from "ramda";
import { items as itemsEnum } from "../enums/items";

let inputs;

const skins = ["player1", "player2", "player3"];

const players = [];

const items = [];

let cursor;

let cursorLocation = 0;
const cursorLocations = [];

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

    const keys = game.input.keyboard.createCursorKeys();
    const space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    const esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    keys.up.onDown.add(() => menuAction("up"));
    keys.down.onDown.add(() => menuAction("down"));
    keys.left.onDown.add(() => menuAction("left"));
    keys.right.onDown.add(() => menuAction("right"));
    space.onDown.add(() => menuAction("select"));
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
                sorted.length === 0 ? 0 : cursorLocations.indexOf(sorted[0]);
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
            location.cancel();
            break;
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

    for (let i = 0; i < 12; i++) {
        const x = 100 + (i % 4) * 110;
        const y = 160 + Math.floor(i / 4) * 70;
        const item = new LobbyItem(i, x, y);

        items.push(item);

        cursorLocations.push({
            x,
            y: y + 30,
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
        this.type = type;
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

        const label = game.add.bitmapText(
            x,
            y + 24,
            "mduel-menu",
            this.describeItem(type),
            16
        );

        label.anchor.setTo(0.5);
    }

    describeItem(type) {
        switch (type) {
            case 0:
                return "Skull";
            case 1:
                return "Volts";
            case 2:
                return "Cloak";
            case 3:
                return "Mine";
            case 4:
                return "Gun";
            case 5:
                return "TNT";
            case 6:
                return "Boots";
            case 7:
                return "Grenade";
            case 8:
                return "Puck";
            case 9:
                return "Chute";
            case 10:
                return "Hook";
            case 11:
                return "Warp";
            default:
                return type + "";
        }
    }

    get enabled() {
        return this.icon.visible;
    }

    set enabled(value) {
        this.icon.visible = value;
        this.disabledSprite.visible = !value;
    }
}

export default { init, create, update, render };
