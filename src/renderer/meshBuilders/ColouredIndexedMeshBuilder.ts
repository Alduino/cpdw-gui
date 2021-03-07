import Vector2 from "@equinor/videx-vector2";
import Color from "color";
import MeshBuilder, {AttributeNames, MeshAttributes, MeshType, PackedMesh} from "../MeshBuilder";

export type ColouredIndexedMeshAttrs = "vertices" | "vertexIndices" | "colours" | "colourIndices";

export type Vertex = [Vector2, [number, number, number, number]];

export interface ColouredIndexedMesh {
    // defaults to the previous value, or triangles
    type?: MeshType;

    // list of all the vertices
    vertices: Vertex[];

    // creates triangles from vertex indices
    indices: number[];
}

export default class ColouredIndexedMeshBuilder<T> implements MeshBuilder<ColouredIndexedMeshAttrs, T> {
    static readonly ATTR_COORDS = "coordinates";
    static readonly ATTR_COLOUR = "colour";

    readonly attributeNames: AttributeNames<ColouredIndexedMeshAttrs> = {
        vertices: ColouredIndexedMeshBuilder.ATTR_COORDS,
        vertexIndices: ColouredIndexedMeshBuilder.ATTR_COORDS,
        colours: ColouredIndexedMeshBuilder.ATTR_COLOUR,
        colourIndices: ColouredIndexedMeshBuilder.ATTR_COLOUR
    };

    readonly attributeTypes: MeshAttributes<ColouredIndexedMeshAttrs> = {
        vertices: "ARRAY_BUFFER",
        colours: "ARRAY_BUFFER",
        vertexIndices: "ELEMENT_ARRAY_BUFFER",
        colourIndices: "ELEMENT_ARRAY_BUFFER"
    };

    triMode: MeshType = MeshType.triangles;
    attributeValues: PackedMesh<ColouredIndexedMeshAttrs>;
    vertexCount: number;

    constructor(private generate: (param: T) => ColouredIndexedMesh) {}

    build(param: T): void {
        const mesh = this.generate(param);

        this.attributeValues = {
            vertices: new Float32Array(mesh.vertices.flatMap(v => v[0].toArray())),
            colours: new Float32Array(mesh.vertices.flatMap(v => v[1])),
            vertexIndices: new Uint16Array(mesh.indices),
            colourIndices: new Uint16Array(mesh.indices)
        };
    }
}
