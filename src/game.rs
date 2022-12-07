use std::fmt::Display;

use rand::{random, Rng};

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

#[cfg_attr(feature = "wasm", wasm_bindgen)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Square {
    Water = 1,
    Debris = 2,
    Battleship = 3,
    Destroyer = 4,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum ShipSize {
    Battleship = 5,
    Destroyer = 4,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Result {
    Miss = 1,
    Shot = 2,
    Sink = 3,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Direction {
    Vertical = 1,
    Horizontal = 2,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Position {
    pub kind: Square,
    pub vessel_id: i16,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub struct Battleship {
    pub width: u8,
    pub height: u8,
    grid: Vec<Vec<Position>>,
    pending: Vec<u8>,
    vessel_counter: i16,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub struct Size(pub u8, pub u8);

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub struct Shot(pub Result, pub Position);

pub const EMPTY: (Square, Square) = (Square::Water, Square::Debris);

pub const SHIPS: (Square, Square) = (Square::Battleship, Square::Destroyer);

#[cfg_attr(feature = "wasm", wasm_bindgen)]
impl Battleship {
    pub fn new(size: Size, allocate: bool) -> Self {
        let mut battleship = Self {
            width: size.0,
            height: size.1,
            grid: (0..size.1)
                .map(|_| {
                    (0..size.0)
                        .map(|_| Position::new())
                        .collect::<Vec<Position>>()
                })
                .collect::<Vec<Vec<Position>>>(),
            pending: Vec::new(),
            vessel_counter: 0,
        };
        if allocate {
            battleship.allocate(vec![
                Square::Battleship,
                Square::Destroyer,
                Square::Destroyer,
            ]);
        }
        battleship
    }

    pub fn fill(&mut self, x0: u8, y0: u8, size: u8, direction: Direction, value: Square) -> i16 {
        let mut x = x0;
        let mut y = y0;

        for _ in 0..size {
            match self.grid[y as usize][x as usize].kind {
                Square::Battleship | Square::Destroyer => return -1,
                _ => (),
            }
            if direction == Direction::Vertical {
                y += 1
            } else if direction == Direction::Horizontal {
                x += 1
            }
        }

        let vessel_id = self.vessel_counter;
        self.vessel_counter += 1;

        let mut x = x0;
        let mut y = y0;

        for _ in 0..size {
            self.grid[y as usize][x as usize].kind = value;
            self.grid[y as usize][x as usize].vessel_id = vessel_id;
            if direction == Direction::Vertical {
                y += 1
            } else if direction == Direction::Horizontal {
                x += 1
            }
        }

        vessel_id
    }

    pub fn shoot(&mut self, coordinate: &str) -> Option<Shot> {
        match coordinate.len() {
            2 | 3 => (),
            _ => return None,
        }

        let x = (coordinate.chars().next()? as u8).saturating_sub(65);
        let y = coordinate[1..].parse::<u8>().unwrap_or(0).saturating_sub(1);

        Some(self._shoot(x, y))
    }

    pub fn destroy(&mut self) {
        for y in 0..self.height {
            for x in 0..self.width {
                self._shoot(x, y);
            }
        }
    }

    pub fn repr(&self, emoji: bool, axis: bool) -> String {
        let mut buffer = Vec::<String>::new();

        if axis {
            let axis_l = (0..self.width)
                .map(|index| ((index + 65) as char).to_string())
                .collect::<Vec<String>>();
            let axis_s = axis_l.join(if emoji { " " } else { "" });

            buffer.push("   ".to_string());
            buffer.push(axis_s);
            buffer.push("\n".to_string());
        }

        for y in 0..self.height {
            if axis {
                buffer.push(format!("{:2} ", y + 1));
            }

            for x in 0..self.width {
                let position = &self.grid[y as usize][x as usize];
                let value = if emoji {
                    position.kind.emoji()
                } else {
                    position.kind.value()
                };
                buffer.push(value.to_string())
            }

            buffer.push("\n".to_string());
        }

        let result = buffer.join("");
        result.strip_suffix('\n').unwrap();
        result
    }

    fn _shoot(&mut self, x: u8, y: u8) -> Shot {
        let mut result = Result::Miss;

        let position = self.grid[y as usize][x as usize];

        match position.kind {
            Square::Battleship | Square::Destroyer => {
                self.grid[y as usize][x as usize].kind = Square::Debris;
                self.pending[position.vessel_id as usize] -= 1;
                if self.pending[position.vessel_id as usize] == 0 {
                    result = Result::Sink
                } else {
                    result = Result::Shot
                }
            }
            _ => (),
        }

        Shot(result, position)
    }
}

impl Battleship {
    pub fn allocate(&mut self, ships: Vec<Square>) {
        for ship in ships {
            let mut x0: u8 = 0;
            let mut y0: u8 = 0;

            let size = match ship {
                Square::Battleship => ShipSize::Battleship as u8,
                Square::Destroyer => ShipSize::Destroyer as u8,
                _ => 0,
            };

            let mut rng = rand::thread_rng();

            loop {
                let direction = match random::<bool>() {
                    true => Direction::Vertical,
                    false => Direction::Horizontal,
                };

                if direction == Direction::Vertical {
                    x0 = rng.gen_range(0..self.width);
                    y0 = rng.gen_range(0..self.height - size + 1);
                } else if direction == Direction::Horizontal {
                    x0 = rng.gen_range(0..self.width - size + 1);
                    y0 = rng.gen_range(0..self.height);
                }

                let vessel_id = self.fill(x0, y0, size, direction, ship);
                if vessel_id != -1 {
                    self.pending.push(size);
                    break;
                }
            }
        }
    }
}

impl Default for Battleship {
    fn default() -> Self {
        Self::new(Size(10, 10), true)
    }
}

impl Display for Battleship {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.repr(false, true))
    }
}

impl Position {
    pub fn new() -> Self {
        Self {
            kind: Square::Water,
            vessel_id: -1,
        }
    }
}

impl Default for Position {
    fn default() -> Self {
        Self::new()
    }
}

impl Square {
    pub fn value(&self) -> &str {
        match self {
            Square::Water => "1",
            Square::Debris => "2",
            Square::Battleship => "3",
            Square::Destroyer => "4",
        }
    }

    pub fn text(&self) -> &str {
        match self {
            Square::Water => "water",
            Square::Debris => "debris",
            Square::Battleship => "battleship",
            Square::Destroyer => "destroyer",
        }
    }

    pub fn emoji(&self) -> &str {
        match self {
            Square::Water => "🌊",
            Square::Debris => "🪵",
            Square::Battleship => "🚢",
            Square::Destroyer => "⛵",
        }
    }
}

impl Display for Result {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Result::Miss => write!(f, "missed"),
            Result::Shot => write!(f, "shot"),
            Result::Sink => write!(f, "sank"),
        }
    }
}
