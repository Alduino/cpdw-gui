import UniformVariable from "./UniformVariable";
import Variable, {Precision, VariableCreator} from "../../Variable";
import {Vec4} from "../../util/Vec4";
import {GLProgram, GLUniforms, UniformType} from "../../../graphics";

export default class Vec4UniformVariable extends UniformVariable<Vec4, GLUniforms.f4> {
    protected getPrecisionKeyword(): Precision {
        return this.precision;
    }

    protected getTypeKeyword(): string {
        return "vec4";
    }

    constructor(program: GLProgram, name: string, location: number, private precision?: Precision) {
        super(program, name, location, UniformType.f4);
    }

    set(value: Vec4): void {
        this.uniform.set(...value);
    }
}

class UVec4Creator extends VariableCreator<Vec4> {
    constructor(name: string, private precision?: Precision) {
        super(name);
    }

    protected createVariable(program: GLProgram, location: number): Variable<Vec4> {
        return new Vec4UniformVariable(program, this.name, location, this.precision);
    }
}

export function uVec4(name: string, precision?: Precision): VariableCreator<Vec4> {
    return new UVec4Creator(name, precision);
}
