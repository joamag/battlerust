import React, { FC, useMemo } from "react";

import "./square.css";

type SquareProps = {
    value: string;
    style?: string[];
    onClick?: () => void;
};

export const Square: FC<SquareProps> = ({ value, style = [], onClick }) => {
    const classes = useMemo(() => ["square", ...style].join(" "), [style]);
    return (
        <span className={classes} onClick={onClick}>
            {value}
        </span>
    );
};

export default Square;
