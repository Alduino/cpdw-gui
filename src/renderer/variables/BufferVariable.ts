import Variable from "../Variable";
import Bindable, {bindableSymbol} from "./Bindable";

export interface BufferValue<T> {
    values: T[];
    indices: number[];
}

export default abstract class BufferVariable<T> extends Variable<BufferValue<T>> implements Bindable {
    private static packIndices(indices: number[]) {
        return new Uint16Array(indices);
    }

    private valueBuffer: WebGLBuffer;
    private indexBuffer: WebGLBuffer;

    // Packs the source value into a buffer
    protected abstract pack(value: T[]): BufferSource;

    // Set up the buffer. Note: the buffers have already been bound
    protected abstract setUpPtr(location: number, buffer: WebGLBuffer): void;

    private init() {
        console.log("Init for", this.getAccessor());

        const location = this.getLocation();
        if (location === null || location === -1) return;

        this.valueBuffer = this.ctx.createBuffer();
        this.indexBuffer = this.ctx.createBuffer();

        this.bind();
        this.setUpPtr(location, this.valueBuffer);
        this.unbind();
    }

    protected constructor(
        ctx: WebGLRenderingContext,
        name: string,
        private readonly usage?: GLenum
    ) {
        super(ctx, name);
        if (typeof this.usage === "undefined") this.usage = this.ctx.STATIC_DRAW;

        this.onProgramSet.push(() => this.init());
        this[bindableSymbol] = true;
    }

    set(value: BufferValue<T>) {
        const packedValues = this.pack(value.values);
        const packedIndices = BufferVariable.packIndices(value.indices);

        // the attribute doesn't exist, and doesn't get into init
        if (!this.valueBuffer || !this.indexBuffer) return;

        this.bind();

        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, packedValues, this.usage);
        this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, packedIndices, this.usage);

        this.unbind();
    }

    bind() {
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.valueBuffer);
        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    unbind() {
        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
    }

    [bindableSymbol]: true;
}
