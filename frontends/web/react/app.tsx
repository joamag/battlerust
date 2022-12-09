import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import {
    Button,
    ButtonContainer,
    Footer,
    Link,
    ModalManager,
    ModalManagerHandle,
    PanelSplit,
    Paragraph,
    Section,
    Title,
    ToastManager,
    ToastManagerHandle
} from "emukit";
import { Board } from "./components";
import {
    Battleship,
    result_to_text,
    Square,
    square_to_emoji,
    square_to_text
} from "../lib/battlerust";

import info from "../package.json";

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

    const modalManagerRef = useRef<ModalManagerHandle>(null);
    const toastManagerRef = useRef<ToastManagerHandle>(null);

    const getShowText = () => {
        return gridVisible ? "Grid Visible" : "Grid Hidden";
    };
    const getShowIcon = () => {
        return gridVisible
            ? require("../res/eye.svg")
            : require("../res/eye-closed.svg");
    };
    const showModal = async (
        title = "Alert",
        text?: string,
        contents?: ReactNode
    ): Promise<boolean> => {
        return (
            (await modalManagerRef.current?.showModal(title, text, contents)) ??
            true
        );
    };
    const showToast = async (text: string, error = false, timeout = 3500) => {
        return await toastManagerRef.current?.showToast(text, error, timeout);
    };

    const onSquareClick = async (coordinate: string, index: number) => {
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
                )} a ${square_to_text(position.kind)}`,
                false,
                1000
            );
        } else {
            showToast(
                `${square_to_emoji(
                    position.kind
                )} ${coordinate} - You ${result_to_text(
                    result
                )} (${square_to_text(position.kind)})`,
                true,
                1000
            );
        }

        if (game.finished()) {
            const result = await showModal(
                "Congratulations",
                "You just won the game, congratulations 🎉\nDo you want to start a new game?"
            );
            if (result) {
                game.restart();
                setVisited([]);
            }
        }
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
    const onResetClick = () => {
        game.restart();
        setVisited([]);
        setGameKey(gameKey + 1);
    };

    return (
        <div className="app">
            <ModalManager ref={modalManagerRef} />
            <ToastManager ref={toastManagerRef} />
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
                    version={info.version}
                    versionUrl={
                        "https://github.com/joamag/battlerust/blob/master/CHANGELOG.md"
                    }
                    iconSrc={require("../res/robot.png")}
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
                    <Paragraph>
                        TIP: Start by clicking in a 📦 and see what happens.
                    </Paragraph>
                </Section>
                <Section>
                    <ButtonContainer>
                        <Button
                            text={getShowText()}
                            image={getShowIcon()}
                            imageAlt="show"
                            enabled={gridVisible}
                            style={["simple", "border", "padded"]}
                            onClick={onShowClick}
                        />
                        <Button
                            text={"Destroy"}
                            image={require("../res/no-entry.svg")}
                            imageAlt="pause"
                            style={["simple", "border", "padded"]}
                            onClick={onDestroyClick}
                        />
                        <Button
                            text={"Reset"}
                            image={require("../res/reset.svg")}
                            imageAlt="reset"
                            style={["simple", "border", "padded"]}
                            onClick={onResetClick}
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
