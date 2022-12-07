import { startApp } from "./react";
import { Battleship, default as wasm } from "./lib/battlerust";

(async () => {
    await wasm();

    const game = new Battleship();

    await startApp("app", { game: game, background: "264653" });
})();
