import React, { FC } from "react";
import Square from "../square/square";
import { Battleship, number_to_square } from "../../../lib/battlerust";

import "./board.css";

type BoardProps = {
    game: Battleship;
    style?: string[];
    onSquareClick?: (coordinate: string) => void;
};

export const Board: FC<BoardProps> = ({ game, style = [], onSquareClick }) => {
    const classes = () => ["board", ...style].join(" ");
    const [boardState, updateBoardState] = React.useState<Array<number>>(
        Array.from(game.board())
    );
    const _onSquareClick = (index: number) => {
        const y = Math.floor(index / game.width);
        const x = index % game.width;
        const coordinate = `${String.fromCharCode(65 + x)}${y + 1}`;
        onSquareClick && onSquareClick(coordinate);
        updateBoardState(Array.from(game.board()));
    };
    return (
        <div className={classes()}>
            {boardState.map((number, index) => (
                <span key={`${index}-${number}`}>
                    {index % 10 === 0 && index !== 0 && <br />}
                    <Square
                        square={number_to_square(number)}
                        onClick={() => _onSquareClick(index)}
                    />
                </span>
            ))}
        </div>
    );
};

export default Board;
