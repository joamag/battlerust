use rand::{random, Rng};

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Square {
    Water = 1,
    Debris = 2,
    Battleship = 3,
    Destroyer = 4,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum ShipSize {
    Battleship = 5,
    Destroyer = 4,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Result {
    Miss = 1,
    Shot = 2,
    Sink = 3,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Direction {
    Vertical = 1,
    Horizontal = 2,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Position {
    kind: Square,
    vessel_id: i16,
}

pub struct Battleship {
    width: u8,
    height: u8,
    grid: Vec<Vec<Position>>,
    pending: Vec<u8>,
    vessel_counter: i16,
}

pub const EMPTY: (Square, Square) = (Square::Water, Square::Debris);

pub const SHIPS: (Square, Square) = (Square::Battleship, Square::Destroyer);

impl Battleship {
    pub fn new(size: (u8, u8), allocate: bool) -> Self {
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

    pub fn shoot(&mut self, coordinate: &str) -> (Result, Position) {
        match coordinate.len() {
            2 | 3 => (),
            _ => println!("error"), // this must be replaced with an error
        }

        let x = (coordinate.chars().next().unwrap() as u8 - 65) as u8;
        let y = (coordinate[1..].parse::<u8>().unwrap() - 1) as u8;

        self._shoot(x, y)
    }

    pub fn destroy(&mut self) {
        for y in 0..self.height {
            for x in 0..self.width {
                self._shoot(x, y);
            }
        }
    }

    fn _shoot(&mut self, x: u8, y: u8) -> (Result, Position) {
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

        (result, position)
    }
}

impl Default for Battleship {
    fn default() -> Self {
        Self::new((10, 10), true)
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
