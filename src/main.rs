pub mod game;

use crate::game::Battleship;

fn main() {
    println!("Battlerust!");
    Battleship::new((10, 10), true);
}
