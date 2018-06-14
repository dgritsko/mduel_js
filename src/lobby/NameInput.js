import Popup from "./Popup";
import TextInput from "./TextInput";
import Label from "./Label";
import { colors } from "../enums/colors";

export default class NameInput {
    constructor(x, y) {
        const popupWidth = 250;
        const popupHeight = 130;

        const textInputWidth = 180;

        this.popup = new Popup(
            x - popupWidth / 2,
            y - popupHeight / 2,
            popupWidth,
            popupHeight
        );

        this.textInput = new TextInput(
            popupWidth / 2 - textInputWidth / 2,
            popupHeight - 50,
            textInputWidth,
            24,
            {
                cornerRadius: 0,
                borderColor: colors.LIGHT_PURPLE,
                maxLength: 14
            }
        );

        this.popup.addChild(this.textInput.g);

        this.label1 = new Label(popupWidth / 2, 30, "Enter your name");

        this.popup.addChild(this.label1.g);
    }

    destroy() {
        this.popup.g.destroy();
    }

    set value(v) {
        this.textInput.text = v;
    }

    get value() {
        return this.textInput.text;
    }

    get focused() {
        return this.textInput.focused;
    }

    set focused(v) {
        this.textInput.focused = v;
    }
}
