import Vector2 from "@equinor/videx-vector2";

export default class Mesh {
    vertices: Vector2[];
    indices: number[];

    constructor(vertices: Vector2[], indices: number[]) {
        this.vertices = vertices;
        this.indices = indices;
    }
}
