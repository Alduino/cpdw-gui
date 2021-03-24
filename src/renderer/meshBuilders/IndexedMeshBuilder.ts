import Vector2 from "@equinor/videx-vector2";
import MeshBuilder, {MeshType} from "../MeshBuilder";
import DrawerBase from "../DrawerBase";
import {aVec2b} from "../variables/attribute/Vec2BufferAttributeVariable";

export interface IndexedMesh {
    // defaults to the previous value, or triangles
    type?: MeshType;

    // list of all the vertices
    vertices: Vector2[];

    // creates triangles from vertex indices
    indices: number[];
}

export default class IndexedMeshBuilder<T extends DrawerBase> implements MeshBuilder<T> {
    static readonly ATTR_COORD = aVec2b("meshCoord", {});

    vertexCount: number;
    triMode: MeshType = MeshType.triangles;

    constructor(private generate: (param: T) => IndexedMesh) {}

    build(param: T): void {
        const mesh = this.generate(param);

        param.getVariable(IndexedMeshBuilder.ATTR_COORD).set({
            values: mesh.vertices,
            indices: mesh.indices
        });

        this.vertexCount = mesh.indices.length;

        if (mesh.type) this.triMode = mesh.type;
    }
}
