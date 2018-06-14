import Keyboard from "./keyboard";
import Gamepad from "./gamepad";

const setupInput = identifier => {
    const type = identifier.substring(0, 1);
    const id = parseInt(identifier.substring(1, 2), 10);

    if (type === "k" && typeof id === "number") {
        return new Keyboard(id);
    } else if (type === "g" && typeof id === "number") {
        return new Gamepad(id);
    } else {
        console.error(`Input not supported: ${identifier}`);
    }
};

export { setupInput };
