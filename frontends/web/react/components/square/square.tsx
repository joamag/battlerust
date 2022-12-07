import React, { FC } from "react";

import "./square.css";

type SquareProps = {
    value: string;
    style?: string[];
    onClick?: () => void;
};

export const Square: FC<SquareProps> = ({ value, style = [], onClick }) => {
    const classes = () => ["square", ...style].join(" ");
    return (
        <span className={classes()} onClick={onClick}>
            {value}
        </span>
    );
};

export default Square;
