import type { CSSProperties } from "react";


export interface DecorativeCircleProps {
    className?: string;
    style?: CSSProperties;
}

export interface DecorativeCirclesProps {
    colors: {
        circleTop: string;
        circleBottom: string;
        circleRight: string;
    };
}