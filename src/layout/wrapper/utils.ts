import Color from "color";
import Vector2 from "@equinor/videx-vector2";

export function glColour(colour: Color) {
    if (!colour) return null;
    return [colour.red() / 255, colour.green() / 255, colour.blue() / 255, colour.alpha()] as const;
}

export type Vec2 = Vector2 | [number, number];

export function glVec2(vec: Vec2) {
    if (!vec) return null;
    return new Vector2(vec);
}
