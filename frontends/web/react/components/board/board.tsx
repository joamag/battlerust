import React, { FC } from "react";
import { Battleship } from "../../../lib/battlerust";

import "./board.css";

type BoardProps = {
    game: Battleship;
    style?: string[];
};

export const Board: FC<BoardProps> = ({ style = [] }) => {
    const classes = () => ["board", ...style].join(" ");
    return <div className={classes()}>This is the board</div>;
};

export default Board;
