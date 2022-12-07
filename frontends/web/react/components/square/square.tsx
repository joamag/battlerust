import React, { FC } from "react";
import { square_to_emoji, Square as _Square } from "../../../lib/battlerust";

import "./square.css";

type SquareProps = {
    square: _Square;
    style?: string[];
    onClick?: () => void;
};

export const Square: FC<SquareProps> = ({ square, style = [], onClick }) => {
    const classes = () => ["square", ...style].join(" ");
    return (
        <span className={classes()} onClick={onClick}>
            {square_to_emoji(square)}
        </span>
    );
};

export default Square;
