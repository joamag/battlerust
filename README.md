# Battlerust

A Battleship game implementation in Rust 🦀.

## Challenge

Create an application to allow a single human player to play a one-sided game of Battleships against ships placed by the computer.

The program should create a 10x10 grid, and place a number of ships on the grid at random with the following sizes:

* 1x Battleship (5 squares)
* 2x Destroyers (4 squares)

The player enters coordinates of the form “A5”, where "A" is the column and "5" is the row, to specify a square to target. Shots result in hits, misses or sinks. The game ends when all ships are sunk.

## Build

### Native

```bash
cargo build
```

### WASM for Node.js

```bash
cargo install wasm-pack
wasm-pack build --release --target=nodejs -- --features wasm
```

### WASM with WASI

```bash
rustup target add wasm32-wasi
cargo build --release  --target wasm32-wasi
```

### Run

### Native

```bash
cargo run
```

### WASM with WASI

```bash
cd target/wasm32-wasi/release
wasmtime battlerust.wasm
```
