import BufferVariable from "../BufferVariable";
import AttributeLocator from "../locators/AttributeLocator";
import {VariableLocator} from "../../Variable";

export default abstract class BufferAttributeVariable<T> extends BufferVariable<T> {
    protected abstract getType(): GLenum;
    protected abstract getSize(): number;

    protected getQualifierKeyword(): string {
        return "attribute";
    }

    protected setUpPtr(location: number, buffer: WebGLBuffer): void {
        this.ctx.enableVertexAttribArray(location);
        this.ctx.vertexAttribPointer(location, this.getSize(), this.getType(), false, 0, 0);
    }

    protected constructor(
        ctx: WebGLRenderingContext,
        name: string,
        usage?: GLenum
    ) {
        super(ctx, name, usage);
    }

    protected createLocator(program: WebGLProgram): VariableLocator<any> {
        return new AttributeLocator(this.ctx, program);
    }
}
