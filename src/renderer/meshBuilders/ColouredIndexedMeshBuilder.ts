import Vector2 from "@equinor/videx-vector2";
import MeshBuilder from "../MeshBuilder";
import DrawerBase from "../DrawerBase";
import {aVec2b} from "../variables/attribute/Vec2BufferAttributeVariable";
import {aVec4b} from "../variables/attribute/Vec4BufferAttributeVariable";
import {DrawType} from "../../graphics";

export type Colour = readonly [number, number, number, number];
export type Vertex = [Vector2, Colour];

export interface ColouredIndexedMesh {
    // defaults to the previous value, or triangles
    type?: DrawType;

    // list of all the vertices
    vertices: Vertex[];

    // creates triangles from vertex indices
    indices: number[];
}

export default class ColouredIndexedMeshBuilder<T extends DrawerBase> implements MeshBuilder<T> {
    static readonly ATTR_COORD = aVec2b("meshCoord", {});
    static readonly ATTR_COLOUR = aVec4b("meshColour", {});

    triMode: DrawType = DrawType.triangles;
    vertexCount: number;

    constructor(private generate: (param: T) => ColouredIndexedMesh) {}

    build(param: T): void {
        const mesh = this.generate(param);

        // set our variables
        param.getVariable(ColouredIndexedMeshBuilder.ATTR_COORD).set({
            values: mesh.vertices.map(v => v[0]),
            indices: mesh.indices
        });

        param.getVariable(ColouredIndexedMeshBuilder.ATTR_COLOUR).set({
            values: mesh.vertices.map(v => v[1]),
            indices: mesh.indices
        });

        this.vertexCount = mesh.indices.length;
        if (typeof mesh.type !== "undefined") this.triMode = mesh.type;
    }
}
