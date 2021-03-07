export enum MeshType {
    triangles,
    triangleFan,
    triangleStrip
}

type KeysOfType<TSource, TType> = {
    [key in keyof TSource]: TSource[key] extends TType ? key : never;
}[keyof TSource];

export type MeshAttributes<T extends string> = {
    [key in T]: KeysOfType<WebGLRenderingContext, GLenum>;
};

export type AttributeNames<T extends string> = {
    [key in T]: string;
};

export type PackedMesh<T extends string> = {
    [key in T]: BufferSource;
};

export default interface MeshBuilder<TKeys extends string, TParam> {
    /**
     * List of the mesh's attributes and their types. Must be set in constructor
     */
    readonly attributeTypes: MeshAttributes<TKeys>;

    /**
     * Maps attribute names to the names used in the shader.
     * Multiple attributes can have the same name, all of these will be bound.
     */
    readonly attributeNames: AttributeNames<TKeys>;

    /**
     * List of values for each attribute. Should be set in each update
     */
    attributeValues: PackedMesh<TKeys>;

    /**
     * The number of vertexes this mesh has
     */
    vertexCount: number;

    /**
     * The triangle mode of the mesh. Can be set at any time
     */
    triMode: MeshType;

    /**
     * Re-calculate the mesh, and fill out attributeValues
     */
    build(param: TParam): void;
}
