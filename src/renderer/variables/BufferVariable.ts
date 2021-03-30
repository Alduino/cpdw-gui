import Variable from "../Variable";
import {GLBuffer, GLProgram} from "../../graphics";
import {BufferUsage} from "../../graphics/webgl/WebGLBuffer";
import {BufferElementType, BufferType} from "../../graphics/interfaces/Buffer";

export interface BufferValue<T> {
    values: T[];
    indices: number[];
}

export default abstract class BufferVariable<T> extends Variable<BufferValue<T>> {
    private static packIndices(indices: number[]) {
        return new Uint16Array(indices);
    }

    private readonly valueBuffer: GLBuffer;
    private readonly indexBuffer: GLBuffer;

    // Packs the source value into a buffer
    protected abstract pack(value: T[]): BufferSource;

    protected constructor(
        program: GLProgram,
        name: string,
        location: number,
        elemType: BufferElementType
    ) {
        super(program, name, location);

        this.valueBuffer = program.createBuffer(BufferType.vertexData, elemType);
        this.indexBuffer = program.createBuffer(BufferType.vertexDataIndices, BufferElementType._);
    }

    protected getValueBuffer() {
        return this.valueBuffer;
    }

    protected getIndexBuffer() {
        return this.indexBuffer;
    }

    set(value: BufferValue<T>) {
        const packedValues = this.pack(value.values);
        const packedIndices = BufferVariable.packIndices(value.indices);

        // the attribute doesn't exist, and doesn't get into init
        if (!this.valueBuffer || !this.indexBuffer) return;

        this.valueBuffer.write(packedValues);
        this.indexBuffer.write(packedIndices);
    }
}
