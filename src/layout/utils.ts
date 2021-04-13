import Vector2 from "@equinor/videx-vector2";
import Color from "color";

export type RgbaColour = [number, number, number, number];

export type Vec2 = Vector2 | [number, number];
export type Colour = Color | RgbaColour;

export function vec2(input: Vec2 | undefined, def: Vec2 | null = null): Vector2 {
    if (input == null) return def == null ? null : vec2(def, null);
    if (Array.isArray(input)) return new Vector2(input);
    return input;
}

export function colour(input: Colour | undefined, def: Colour | null = null): RgbaColour {
    if (input == null) return def == null ? null : colour(def, null);
    if (Array.isArray(input)) return input;
    return [input.red() / 255, input.green() / 255, input.blue() / 255, input.alpha()];
}
