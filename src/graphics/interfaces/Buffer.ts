export enum BufferType {
    vertexData,
    vertexDataIndices
}

export enum BufferElementType {
    /** Used only for vertex data indices, which don't have a type */
    _,
    f1,
    f2,
    f3,
    f4
}

export default interface Buffer {
    write(data: BufferSource): void;
    writePart(data: BufferSource, offset: number): void;
}
