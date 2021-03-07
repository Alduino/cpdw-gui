import Vector2 from "@equinor/videx-vector2";

export enum MeshType {
    triangles,
    triangleFan,
    triangleStrip
}

export default class Mesh {
    type: MeshType;
    vertices: Vector2[];
    indices: number[];

    constructor(type: MeshType, vertices: Vector2[], indices: number[] = null) {
        this.type = type;
        this.vertices = vertices;
        this.indices = indices;
    }
}
