import React, {FC} from "react";
import Color from "color";
import Vector2 from "@equinor/videx-vector2";
import {i} from "../dom/intrinsic-elements";
import {glColour, glVec2, Vec2} from "./utils";

export interface RectangleProps {
    size: Vec2;
    fill: Color;

    borderSize?: Vec2;
    borderColour?: Color;

    position?: Vec2;
    scale?: Vec2;
}

export const Rectangle: FC<RectangleProps> = props => (
    <i.rectangle
        size={glVec2(props.size)}
        fill={glColour(props.fill)}

        borderSize={glVec2(props.borderSize) || Vector2.zero}
        borderColour={glColour(props.borderColour) ?? [0, 0, 0, 1]}

        position={glVec2(props.position) || Vector2.zero}
        scale={glVec2(props.scale) || Vector2.one}
    >
        {props.children}
    </i.rectangle>
);
