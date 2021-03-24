import UniformVariable from "./UniformVariable";
import Variable, {Precision, VariableCreator} from "../../Variable";
import {Vec4} from "../../util/Vec4";

export default class Vec4UniformVariable extends UniformVariable<Vec4> {
    protected getPrecisionKeyword(): Precision {
        return this.precision;
    }

    protected getTypeKeyword(): string {
        return "vec4";
    }

    constructor(ctx: WebGLRenderingContext, name: string, private precision?: Precision) {
        super(ctx, name);
    }

    setValue(value: Vec4, location: WebGLUniformLocation): void {
        this.ctx.uniform4f(location, ...value);
    }
}

class UVec4Creator extends VariableCreator<Vec4> {
    constructor(name: string, private precision?: Precision) {
        super(name);
    }

    protected createVariable(ctx: WebGLRenderingContext): Variable<Vec4> {
        return new Vec4UniformVariable(ctx, this.name, this.precision);
    }
}

export function uVec4(name: string, precision?: Precision): VariableCreator<Vec4> {
    return new UVec4Creator(name, precision);
}
