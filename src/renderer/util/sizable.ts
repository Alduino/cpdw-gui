import Vector2 from "@equinor/videx-vector2";
import EventEmitter from "events";

export interface Sizable {
    size: Vector2;
}

export function isSizable(obj: any): obj is Sizable {
    if (obj == null) return false;
    if (typeof obj !== "object") return false;
    return typeof obj.size === "object";
}
