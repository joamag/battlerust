import React, { FC, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Footer, Link, PanelSplit, Section } from "emukit";

type AppProps = {
    background?: string;
};

export const App: FC<AppProps> = ({ background }) => {
    useEffect(() => {
        document.body.style.backgroundColor = `#${background}`;
    }, []);
    return (
        <div>
            <PanelSplit
                left={
                    <div className="game-container">
                        This is the section for the battleship
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
        background
    }: {
        background?: string;
    }
) => {
    const elementRef = document.getElementById(element);
    if (!elementRef) return;

    const root = ReactDOM.createRoot(elementRef);
    root.render(<App background={background} />);
};
