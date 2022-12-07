# [Battlerust 🦀 + 🛥️](https://battlerust.joao.me)

A Battleship game implementation in Rust 🦀.

## Challenge

Create an application to allow a single human player to play a one-sided game of Battleships against ships placed by the computer.

The program should create a 10x10 grid, and place a number of ships on the grid at random with the following sizes:

* 1x Battleship (5 squares)
* 2x Destroyers (4 squares)

The player enters coordinates of the form “A5”, where "A" is the column and "5" is the row, to specify a square to target. Shots result in hits, misses or sinks. The game ends when all ships are sunk.

## Deployments

| Provider  | Stable | URL                                                  |
| --------- | ------ | ---------------------------------------------------- |
| Cloudfare | `True` | [battlerust.joao.me](https://battlerust.joao.me)     |
| Cloudfare | `True` | [battlerust.pages.dev](https://battlerust.pages.dev) |

## Build & Run

### Native

```bash
cd frontends/console
cargo build
cargo run
```

### WASM for Web

```bash
cargo install wasm-pack
wasm-pack build --release --target=web --out-dir=frontends/web/lib -- --features wasm
cd frontends/web
npm install && npm run build
cd dist && python3 -m http.server
```

### WASM with WASI

```bash
cd frontends/console
rustup target add wasm32-wasi
cargo build --release  --target wasm32-wasi
cd ../../target/wasm32-wasi/release
wasmtime battlerust-console.wasm
```

## WASM Console

You can use [WebAssembly.sh](https://webassembly.sh) to play around with the [WASI](https://wasi.dev/) compliant [WASM](https://webassembly.org/) assembly and interact with this Web shell in the same way as you would in your normal OS shell.

In alternative you can use the [Wasmtime](https://wasmtime.dev) WASM runtime to run the WASM binary in your local computer.

## Build Automation

[![Build Status](https://github.com/joamag/battlerust/workflows/Main%20Workflow/badge.svg)](https://github.com/joamag/battlerust/actions)
[![crates Status](https://img.shields.io/crates/v/battlerust)](https://crates.io/crates/battlerust)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://www.apache.org/licenses/)
