import Vector2 from "@equinor/videx-vector2";
import MeshBuilder, {MeshType} from "../MeshBuilder";
import DrawerBase from "../DrawerBase";
import {aVec2b} from "../variables/attribute/Vec2BufferAttributeVariable";

// [pos, uv]
export type Vertex = [Vector2, Vector2];

export interface UvIndexedMesh {
    // defaults to the previous value, or triangles
    type?: MeshType;

    // list of all the vertices
    vertices: Vertex[];

    // creates triangles from vertex indices
    indices: number[];
}

export default class UvIndexedMeshBuilder<T extends DrawerBase> implements MeshBuilder<T> {
    static readonly ATTR_COORD = aVec2b("meshCoord", {});
    static readonly ATTR_UV = aVec2b("meshUv", {});

    vertexCount: number;
    triMode: MeshType = MeshType.triangles;

    constructor(private generate: (param: T) => UvIndexedMesh) {}

    build(param: T): void {
        const mesh = this.generate(param);

        param.getVariable(UvIndexedMeshBuilder.ATTR_COORD).set({
            values: mesh.vertices.map(v => v[0]),
            indices: mesh.indices
        });

        param.getVariable(UvIndexedMeshBuilder.ATTR_UV).set({
            values: mesh.vertices.map(v => v[1]),
            indices: mesh.indices
        });

        this.vertexCount = mesh.indices.length;
        if (mesh.type) this.triMode = mesh.type;
    }
}
