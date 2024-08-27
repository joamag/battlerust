import { Battleship, size, default as wasm } from "./lib/battlerust";
import { startApp } from "./react";

(async () => {
    await wasm();

    const game = new Battleship(size(10, 10), true);

    await startApp("app", { game: game, background: "264653" });
})();
