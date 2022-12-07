import React, { FC, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import {
    Footer,
    Link,
    PanelSplit,
    Paragraph,
    Section,
    Title,
    Toast
} from "emukit";
import { Board } from "./components";
import {
    Battleship,
    result_to_text,
    Square,
    square_to_emoji,
    square_to_text
} from "../lib/battlerust";

type AppProps = {
    game: Battleship;
    background?: string;
};

export const App: FC<AppProps> = ({ game, background }) => {
    useEffect(() => {
        document.body.style.backgroundColor = `#${background}`;
    }, []);
    const [toastText, setToastText] = useState<string>();
    const [toastError, setToastError] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    const toastCounterRef = useRef(0);

    const showToast = async (text: string, error = false, timeout = 3500) => {
        setToastText(text);
        setToastError(error);
        setToastVisible(true);
        toastCounterRef.current++;
        const counter = toastCounterRef.current;
        await new Promise((resolve) => {
            setTimeout(() => {
                if (counter !== toastCounterRef.current) return;
                setToastVisible(false);
                resolve(true);
            }, timeout);
        });
    };

    const onSquareClick = (coordinate: string) => {
        const shot = game.shoot(coordinate);
        if (!shot) return;

        const [result, position] = [shot[0], shot[1]];

        if ([Square.Battleship, Square.Destroyer].includes(position.kind)) {
            showToast(
                `${square_to_emoji(
                    position.kind
                )} ${coordinate} - You ${result_to_text(
                    result
                )} a ${square_to_text(position.kind)}`
            );
        } else {
            showToast(
                `${square_to_emoji(
                    position.kind
                )} ${coordinate} - You ${result_to_text(
                    result
                )} (${square_to_text(position.kind)})`,
                true
            );
        }
    };
    const onToastCancel = () => {
        setToastVisible(false);
    };

    return (
        <div className="app">
            <Toast
                text={toastText}
                error={toastError}
                visible={toastVisible}
                onCancel={onToastCancel}
            />
            <PanelSplit
                left={
                    <div className="display-container">
                        <Board game={game} onSquareClick={onSquareClick} />
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
