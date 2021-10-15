import Vector2 from "@equinor/videx-vector2";
import Color from "color";
import {getSize, getSize2, Size, Size2, SizeString} from "./util/size";

export type RgbaColour = [number, number, number, number];

export type Vec2 = Vector2 | [number, number];
export type Colour = Color | RgbaColour;
export type SizeBases = Size | SizeString | number;
export type Size2Bases = Size | SizeString | number | Size2 | [SizeString, SizeString] | [number, number] | Vector2;

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

export function size(input: SizeBases | undefined, def: SizeBases | null = null): Size {
    if (input == null) return def == null ? null : size(def, null);
    if (typeof input === "string") return getSize(input);
    if (typeof input === "number") return getSize(`${input}px` as const);
    return input;
}

function isNumberArr(input: any[]): input is number[] {
    return typeof input[0] === "number";
}

function isSize(input: any): input is Size {
    if (!input) return false;
    if (typeof input.type !== "string") return false;
    if (typeof input.value !== "number") return false;
}

export function size2(input: Size2Bases | undefined, def: Size2Bases | null = null): Size2 {
    if (input == null) return def == null ? null : size2(def, null);

    if (typeof input === "number") {
        const s = getSize(`${input}px` as const);
        return size2({x: s, y: s});
    }

    if (typeof input === "string") {
        const s = getSize(input);
        return size2({x: s, y: s});
    }

    if (input instanceof Vector2) {
        return getSize2(`${input.x}px` as const, `${input.y}px` as const);
    }

    if (isSize(input)) {
        return size2({x: input, y: input});
    }

    if (Array.isArray(input)) {
        if (isNumberArr(input)) return size2(new Vector2(input));
        return getSize2(...input);
    }

    return input;
}
