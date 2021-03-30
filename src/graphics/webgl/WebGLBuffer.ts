import WebGLBase from "./WebGLBase";
import Buffer, {BufferElementType, BufferType} from "../interfaces/Buffer";
import {BrowserBuffer} from "./browser-types";

export enum BufferUsage {
    // only set once
    static,

    // set occasionally
    dynamic,

    // set very often
    stream
}

export default class WebGLBuffer extends WebGLBase implements Buffer {
    private readonly glBuffer: BrowserBuffer;

    constructor(
        parent: WebGLBase | WebGLRenderingContext,
        private target: BufferType,
        private elemType: BufferElementType,
        private usage: BufferUsage
    ) {
        super(parent);

        this.glBuffer = this.gl.createBuffer();
    }

    private get glTarget(): GLenum {
        switch (this.target) {
            case BufferType.vertexData:
                return this.gl.ARRAY_BUFFER;
            case BufferType.vertexDataIndices:
                return this.gl.ELEMENT_ARRAY_BUFFER;
            default:
                throw new Error("Invalid target");
        }
    }

    private get glUsage(): GLenum {
        switch (this.usage) {
            case BufferUsage.static:
                return this.gl.STATIC_DRAW;
            case BufferUsage.dynamic:
                return this.gl.DYNAMIC_DRAW;
            case BufferUsage.stream:
                return this.gl.STREAM_DRAW;
            default:
                throw new Error("Invalid usage");
        }
    }

    get elemLength() {
        switch (this.elemType) {
            case BufferElementType.f1:
                return 1;
            case BufferElementType.f2:
                return 2;
            case BufferElementType.f3:
                return 3;
            case BufferElementType.f4:
                return 4;
            default:
                throw new Error(`Invalid element type, ${BufferElementType[this.elemType] || this.elemType}`);
        }
    }

    get glType() {
        switch (this.elemType) {
            case BufferElementType.f1:
            case BufferElementType.f2:
            case BufferElementType.f3:
            case BufferElementType.f4:
                return this.gl.FLOAT;
            default:
                throw new Error(`Invalid element type, ${BufferElementType[this.elemType] || this.elemType}`);
        }
    }

    write(data: BufferSource): void {
        this.use();
        this.gl.bufferData(this.glTarget, data, this.glUsage);
    }

    writePart(data: BufferSource, offset: number): void {
        this.use();
        this.gl.bufferSubData(this.glTarget, offset, data);
    }

    use() {
        const targetName = this.target === BufferType.vertexDataIndices ? "indices" : "data";
        const key = `${this.constructor.name}:${targetName}`;

        const glTarget = this.glTarget;

        this.bind(() => {
            this.gl.bindBuffer(glTarget, this.glBuffer);
        }, key);
    }

    protected doCleanup() {
        this.gl.deleteBuffer(this.glBuffer);
    }
}
