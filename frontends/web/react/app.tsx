import React, { FC, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import {
    Button,
    ButtonContainer,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;

type AppProps = {
    game: Battleship;
    background?: string;
};

export const App: FC<AppProps> = ({ game, background }) => {
    useEffect(() => {
        document.body.style.backgroundColor = `#${background}`;
    }, []);
    const [gameKey, setGameKey] = useState(0);
    const [gridVisible, setGridVisible] = useState(false);
    const [visited, setVisited] = useState<number[]>([]);
    const [toastText, setToastText] = useState<string>();
    const [toastError, setToastError] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    const toastCounterRef = useRef(0);

    const getShowText = () => {
        return gridVisible ? "Grid Visible" : "Grid Hidden";
    };
    const getShowIcon = () => {
        return gridVisible
            ? require("../res/eye.svg")
            : require("../res/eye-closed.svg");
    };
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

    const onSquareClick = (coordinate: string, index: number) => {
        const shot = game.shoot(coordinate);
        if (!shot) return;

        const [result, position] = [shot[0], shot[1]];

        visited.push(index);
        setVisited(visited);

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

        if (game.finished()) {
            showToast("You just won the game, congratulations 🎉");
            game.restart();
            setVisited([]);
        }
    };
    const onToastCancel = () => {
        setToastVisible(false);
    };
    const onShowClick = () => {
        setGridVisible(!gridVisible);
    };
    const onDestroyClick = () => {
        game.destroy();
        const visited = new Array(game.width * game.height)
            .fill(0)
            .map((_, index) => index);
        setVisited(visited);
        setGameKey(gameKey + 1);
        showToast("You destroyed the game 💣", true);
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
                        <Board
                            key={gameKey}
                            game={game}
                            gridVisible={gridVisible}
                            visited={visited}
                            onSquareClick={onSquareClick}
                        />
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
                <Section>
                    <ButtonContainer>
                        <Button
                            text={"Destroy"}
                            image={require("../res/no-entry.svg")}
                            imageAlt="pause"
                            style={["simple", "border", "padded"]}
                            onClick={onDestroyClick}
                        />
                        <Button
                            text={getShowText()}
                            image={getShowIcon()}
                            imageAlt="show"
                            enabled={gridVisible}
                            style={["simple", "border", "padded"]}
                            onClick={onShowClick}
                        />
                    </ButtonContainer>
                </Section>
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
