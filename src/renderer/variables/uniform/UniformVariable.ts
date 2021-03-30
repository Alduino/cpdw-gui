import Variable from "../../Variable";
import {GLProgram, GLUniform, UniformType} from "../../../graphics";

export default abstract class UniformVariable<T, TUniform extends GLUniform<any>> extends Variable<T> {
    protected readonly uniform: TUniform;

    protected constructor(program: GLProgram, name: string, location: number, uniformType: UniformType) {
        super(program, name, location);
        this.uniform = program.createUniform(uniformType, this.getAccessor(), location) as TUniform;
    }

    protected getQualifierKeyword(): string {
        return "uniform";
    }
}
