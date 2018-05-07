export default class Gamepad {
    constructor(id) {
        let pad;

        switch (id) {
            case 1:
                pad = game.input.gamepad.pad1;
                break;
            case 2:
                pad = game.input.gamepad.pad2;
                break;
            case 3:
                pad = game.input.gamepad.pad3;
                break;
            case 4:
                pad = game.input.gamepad.pad4;
                break;
        }

        this.pad = pad;

        this.isConnected = false;

        pad.addCallbacks(this, {
            onConnect: this.onConnect,
            onDisconnect: this.onDisconnect,
            onDown: this.onDown,
            onUp: this.onUp,
            onAxis: this.onAxis,
            onFloat: this.onFloat
        });
    }

    onConnect() {
        this.isConnected = true;
    }

    onDisconnect() {
        this.isConnected = false;
    }

    onDown() {}

    onUp() {}

    onAxis() {}

    onFloat() {}

    getRawInput() {
        const a = this.pad.isDown(Phaser.Gamepad.XBOX360_A);
        const rTrigger = this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);

        // X axis
        const xInput = this.pad.axis(Phaser.Gamepad.AXIS_0);

        // Y axis
        const yInput = this.pad.axis(Phaser.Gamepad.AXIS_1);

        const left = xInput && xInput < 0;
        const right = xInput && xInput > 0;

        const up = yInput && yInput < 0;
        const down = yInput && yInput > 0;

        return {
            fire: a || rTrigger,
            left,
            right,
            up,
            down
        };
    }
}
