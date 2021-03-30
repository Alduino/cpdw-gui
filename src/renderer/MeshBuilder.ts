import DrawerBase from "./DrawerBase";
import {DrawType} from "../graphics";

type KeysOfType<TSource, TType> = {
    [key in keyof TSource]: TSource[key] extends TType ? key : never;
}[keyof TSource];

export type MeshAttributes<T extends string> = {
    [key in T]: KeysOfType<WebGLRenderingContext, GLenum>;
};

export type AttributeNames<T extends string> = {
    [key in T]: string[];
};

export type PackedMesh<T extends string> = {
    [key in T]: BufferSource;
};

export default interface MeshBuilder<T extends DrawerBase> {
    /**
     * The number of vertexes this mesh has
     */
    vertexCount: number;

    /**
     * The triangle mode of the mesh. Can be set at any time
     */
    triMode: DrawType;

    /**
     * Re-calculate the mesh, and fill out attributeValues
     */
    build(param: T): void;
}
