import Vector2 from "@equinor/videx-vector2";
import MeshBuilder, {AttributeNames, MeshAttributes, MeshType, PackedMesh} from "../MeshBuilder";

export type IndexedMeshAttrs = "vertices" | "indices";

export interface IndexedMesh {
    // defaults to the previous value, or triangles
    type?: MeshType;

    // list of all the vertices
    vertices: Vector2[];

    // creates triangles from vertex indices
    indices: number[];
}

export default class IndexedMeshBuilder<T> implements MeshBuilder<IndexedMeshAttrs, T> {
    static readonly ATTR_COORDS = "coordinates";

    readonly attributeNames: AttributeNames<IndexedMeshAttrs> = {
        vertices: [IndexedMeshBuilder.ATTR_COORDS],
        indices: [IndexedMeshBuilder.ATTR_COORDS]
    };

    readonly attributeTypes: MeshAttributes<IndexedMeshAttrs> = {
        vertices: "ARRAY_BUFFER",
        indices: "ELEMENT_ARRAY_BUFFER"
    };

    attributeValues: PackedMesh<IndexedMeshAttrs>;
    vertexCount: number;
    triMode: MeshType = MeshType.triangles;

    constructor(private generate: (param: T) => IndexedMesh) {}

    build(param: T): void {
        const mesh = this.generate(param);

        this.attributeValues = {
            vertices: new Float32Array(mesh.vertices.flatMap(v => v.toArray())),
            indices: new Uint16Array(mesh.indices)
        };

        this.vertexCount = mesh.indices.length;

        if (mesh.type) this.triMode = mesh.type;
    }
}
