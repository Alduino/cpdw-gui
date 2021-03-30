import Vector2 from "@equinor/videx-vector2";

export default interface Texture {
    writeRgba(data: Uint8Array, size: Vector2): void;
}
