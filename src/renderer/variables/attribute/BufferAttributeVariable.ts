import BufferVariable from "../BufferVariable";
import {GLProgram, BufferElementType} from "../../../graphics";

export default abstract class BufferAttributeVariable<T> extends BufferVariable<T> {
    protected getQualifierKeyword(): string {
        return "attribute";
    }

    protected constructor(
        program: GLProgram,
        name: string,
        location: number,
        elementType: BufferElementType
    ) {
        super(program, name, location, elementType);

        program.createVertexAttribArray(this.getAccessor(), this.getValueBuffer(), this.getIndexBuffer());
    }
}
