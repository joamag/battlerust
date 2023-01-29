#![allow(clippy::uninlined_format_args, unknown_lints)]

use std::io::{self, Write};

use battlerust::game::{Battleship, Size, Square};

fn main() {
    println!("Welcome to Battleship 🛥️");
    println!("You can use the HELP command to obtain help");

    let mut game = Battleship::new(Size(10, 10), true);

    let mut line;

    loop {
        if game.finished() {
            println!("{}", game.repr(true, true));
            println!("You just won the game, congratulations 🎉");
            break;
        }

        line = String::new();

        print!(">> ");
        io::stdout().flush().unwrap();
        io::stdin().read_line(&mut line).unwrap();

        line = line.trim().to_string().to_uppercase();

        match line.as_str() {
            "HELP" => {
                println!("HELP - Prints the current message");
                println!("EXIT - Quits the current game");
                println!("DESTROY - Destroys the current game by shooting all the vessels");
                println!("PRINT - Prints the current state of the game to console");
                println!("EMOJI - Prints the emoji version of the state");
                println!("[X][Y] - Shoots the target at coordinate (eg: A5)");
            }
            "EXIT" => {
                println!("Bye, bye 👋");
                break;
            }
            "DESTROY" => {
                println!("Armageddon is here 💣");
                game.destroy();
            }
            "PRINT" => println!("{}", game),
            "EMOJI" => println!("{}", game.repr(true, true)),
            _ => {
                if let Some(shot) = game.shoot(&line) {
                    let result = shot.0;
                    let position = shot.1;
                    match position.kind {
                        Square::Battleship | Square::Destroyer => println!(
                            "{} You {} a {}",
                            position.kind.emoji(),
                            result,
                            position.kind.text()
                        ),
                        _ => println!(
                            "{} You {} ({})",
                            position.kind.emoji(),
                            result,
                            position.kind.text()
                        ),
                    }
                }
            }
        }
    }
}
