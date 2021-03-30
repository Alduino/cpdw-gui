import UniformVariable from "./UniformVariable";
import Vector2 from "@equinor/videx-vector2";
import Variable, {Precision, VariableCreator} from "../../Variable";
import {GLProgram, GLUniforms, UniformType} from "../../../graphics";

export default class Vec2UniformVariable extends UniformVariable<Vector2, GLUniforms.f2> {
    protected getPrecisionKeyword(): Precision {
        return this.precision;
    }

    protected getTypeKeyword(): string {
        return "vec2";
    }

    constructor(program: GLProgram, name: string, location: number, private precision?: Precision) {
        super(program, name, location, UniformType.f2);
    }

    set(value: Vector2): void {
        this.uniform.set(value.x, value.y);
    }
}

class UVec2Creator extends VariableCreator<Vector2> {
    constructor(name: string, private precision?: Precision) {
        super(name);
    }

    protected createVariable(program: GLProgram, location: number): Variable<Vector2> {
        return new Vec2UniformVariable(program, this.name, location, this.precision);
    }
}

export function uVec2(name: string, precision?: Precision): VariableCreator<Vector2> {
    return new UVec2Creator(name, precision);
}
