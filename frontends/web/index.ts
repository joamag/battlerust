import { startApp } from "./react";
import { Battleship, default as wasm, size } from "./lib/battlerust";

(async () => {
    await wasm();

    const game = new Battleship(size(10, 10), true);

    await startApp("app", { game: game, background: "264653" });
})();
