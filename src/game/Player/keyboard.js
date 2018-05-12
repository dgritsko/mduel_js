import Input from "./input";

export default class Keyboard extends Input {
    constructor(id) {
        super();

        if (id === 1) {
            this.keys = {
                fire: game.input.keyboard.addKey(Phaser.Keyboard.Q),
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
                back: game.input.keyboard.addKey(Phaser.Keyboard.E)
            };
        } else if (id === 2) {
            this.keys = {
                fire: game.input.keyboard.addKey(Phaser.Keyboard.U),
                up: game.input.keyboard.addKey(Phaser.Keyboard.I),
                down: game.input.keyboard.addKey(Phaser.Keyboard.K),
                left: game.input.keyboard.addKey(Phaser.Keyboard.J),
                right: game.input.keyboard.addKey(Phaser.Keyboard.L),
                back: game.input.keyboard.addKey(Phaser.Keyboard.O)
            };
        } else if (id === 3) {
            const keys = game.input.keyboard.createCursorKeys();
            keys.fire = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            keys.back = game.input.keyboard.addKey(
                Phaser.Keyboard.BACKWARD_SLASH
            );
            this.keys = keys;
        } else if (id === 4) {
            this.keys = {
                fire: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_7),
                up: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_8),
                down: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_5),
                left: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_4),
                right: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_6),
                back: game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_9)
            };
        }
    }

    getRawInput() {
        return {
            left: this.keys.left.isDown,
            right: this.keys.right.isDown,
            up: this.keys.up.isDown,
            down: this.keys.down.isDown,
            fire: this.keys.fire.isDown,
            back: this.keys.back.isDown
        };
    }
}
