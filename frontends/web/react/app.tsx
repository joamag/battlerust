import React, { FC, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Footer, Link, PanelSplit, Paragraph, Section, Title } from "emukit";
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
    setTimeout(() => console.info(game.repr(true, true)));
    return (
        <div className="app">
            <PanelSplit
                left={
                    <div className="display-container">
                        <Board game={game} />
                    </div>
                }
            >
                <Title
                    text={"Battlerust"}
                    version={"0.1.1"}
                    versionUrl={
                        "https://github.com/joamag/battlerust/CHANGELOG.md"
                    }
                ></Title>
                <Section>
                    <Paragraph>
                        This is a simple Battleship game built using the{" "}
                        <Link href="https://www.rust-lang.org" target="_blank">
                            Rust Programming Language
                        </Link>{" "}
                        and is running inside this browser with the help of{" "}
                        <Link href="https://webassembly.org/" target="_blank">
                            WebAssembly
                        </Link>
                        .
                    </Paragraph>
                    <Paragraph>
                        You can check the source code of it on{" "}
                        <Link
                            href={"https://github.com/joamag/battlerust"}
                            target="_blank"
                        >
                            GitHub
                        </Link>
                        .
                    </Paragraph>
                </Section>
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
