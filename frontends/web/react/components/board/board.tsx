import React, { FC } from "react";
import {
    Battleship,
    square_to_emoji,
    number_to_square,
    Square as _Square
} from "../../../lib/battlerust";

import "./board.css";

type SquareProps = {
    square: _Square;
    style?: string[];
};

type BoardProps = {
    game: Battleship;
    style?: string[];
};

export const Square: FC<SquareProps> = ({ square, style = [] }) => {
    const classes = () => ["square", ...style].join(" ");
    return <span className={classes()}>{square_to_emoji(square)}</span>;
};

export const Board: FC<BoardProps> = ({ game, style = [] }) => {
    const classes = () => ["board", ...style].join(" ");
    return (
        <div className={classes()}>
            {Array.from(game.board()).map((number, index) => (
                <>
                    {index % 10 === 0 && index !== 0 && <br />}
                    <Square key={index} square={number_to_square(number)} />
                </>
            ))}
        </div>
    );
};

export default Board;
