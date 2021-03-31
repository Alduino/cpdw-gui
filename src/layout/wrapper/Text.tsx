import Color from "color";
import Vector2 from "@equinor/videx-vector2";
import React, {FC} from "react";
import {i} from "../dom/intrinsic-elements";
import {glColour, glVec2, Vec2} from "./utils";

export interface TextProps {
    fill: Color;
    children: string;

    fontSize?: number;

    position?: Vec2;
    scale?: Vec2;
}

export const Text: FC<TextProps> = props => {
    return (
        <i.text
            fill={glColour(props.fill)}
            value={props.children}

            scale={(glVec2(props.scale) || Vector2.one).scale(props.fontSize || 16)}
            position={glVec2(props.position) || Vector2.zero}
        />
    );
};
