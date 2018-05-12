export default class Input {
    getInput(inputEnabled) {
        const rawInput = this.getRawInput();

        const hl = rawInput.left && inputEnabled;
        const hr = rawInput.right && inputEnabled;
        const hu = rawInput.up && inputEnabled;
        const hd = rawInput.down && inputEnabled;
        const hf = rawInput.fire && inputEnabled;
        const hb = rawInput.back && inputEnabled;

        const i = x => (x ? 1 : 0);

        const current = {
            hl: i(hl),
            hr: i(hr),
            hu: i(hu),
            hd: i(hd),
            hf: i(hf),
            hb: i(hb)
        };

        const newPresses = {};

        const makeKey = k => `n${k.substring(1)}`;
        Object.keys(this.prevInput || []).forEach(k => {
            newPresses[makeKey(k)] = i(!this.prevInput[k] && current[k]);
        });

        this.prevInput = Object.assign({}, current);

        return Object.assign({}, current, newPresses);
    }
}
