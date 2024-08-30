import { default as _wasm, Battleship, size } from "./lib/battlerust";
import { startApp } from "./react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;

const wasm = async () => {
    try {
        await _wasm({ module_or_path: require("./lib/battlerust_bg.wasm") });
    } catch (err) {
        if (err instanceof TypeError) {
            await _wasm();
        } else {
            throw err;
        }
    }
};

(async () => {
    await wasm();

    const game = new Battleship(size(10, 10), true);

    await startApp("app", { game: game, background: "264653" });
})();
