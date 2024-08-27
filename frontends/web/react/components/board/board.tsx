import React, { FC, useMemo } from "react";

import { Battleship, number_to_emoji } from "../../../lib/battlerust";
import Square from "../square/square";

import "./board.css";

type BoardProps = {
    game: Battleship;
    gridVisible?: boolean;
    visited?: number[];
    style?: string[];
    onSquareClick?: (coordinate: string, index: number) => void;
};

export const Board: FC<BoardProps> = ({
    game,
    gridVisible = false,
    visited = [],
    style = [],
    onSquareClick
}) => {
    const classes = useMemo(() => ["board", ...style].join(" "), [style]);
    const [boardState, updateBoardState] = React.useState<Array<number>>(
        Array.from(game.board())
    );
    const _onSquareClick = (index: number) => {
        const y = Math.floor(index / game.width);
        const x = index % game.width;
        const coordinate = `${String.fromCharCode(65 + x)}${y + 1}`;
        onSquareClick && onSquareClick(coordinate, index);
        updateBoardState(Array.from(game.board()));
    };
    return (
        <div className={classes}>
            {boardState.map((number, index) => (
                <span key={`${index}-${number}`}>
                    {index % 10 === 0 && index !== 0 && <br />}
                    <Square
                        value={
                            gridVisible || visited.includes(index)
                                ? number_to_emoji(number)
                                : "📦"
                        }
                        onClick={() => _onSquareClick(index)}
                    />
                </span>
            ))}
        </div>
    );
};

export default Board;
