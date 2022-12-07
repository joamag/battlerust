import React, { FC, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Footer, Link, PanelSplit, Section } from "emukit";
import { Board } from "./components";
import { Battleship } from "../lib/battlerust";

type AppProps = {
    game: Battleship;
    background?: string;
};

export const App: FC<AppProps> = ({ game, background }) => {
    useEffect(() => {
        document.body.style.backgroundColor = `#${background}`;
    }, []);
    return (
        <div>
            <PanelSplit
                left={
                    <div className="board-container">
                        <Board game={game} />
                    </div>
                }
            >
                <Section>This is a regular section ?? buttons??</Section>
            </PanelSplit>
            <Footer color={background}>
                Built with ❤️ by{" "}
                <Link href="https://joao.me" target="_blank">
                    João Magalhães
                </Link>
            </Footer>
        </div>
    );
};

export const startApp = (
    element: string,
    {
        game,
        background
    }: {
        game: Battleship;
        background?: string;
    }
) => {
    const elementRef = document.getElementById(element);
    if (!elementRef) return;

    const root = ReactDOM.createRoot(elementRef);
    root.render(<App game={game} background={background} />);
};
