import UniformVariable from "./UniformVariable";
import Vector2 from "@equinor/videx-vector2";
import Variable, {Precision, VariableCreator} from "../../Variable";

export default class Vec2UniformVariable extends UniformVariable<Vector2> {
    protected getPrecisionKeyword(): Precision {
        return this.precision;
    }

    protected getTypeKeyword(): string {
        return "vec2";
    }

    constructor(ctx: WebGLRenderingContext, name: string, private precision?: Precision) {
        super(ctx, name);
    }

    setValue(value: Vector2, location: WebGLUniformLocation): void {
        this.ctx.uniform2f(location, value.x, value.y);
    }
}

class UVec2Creator extends VariableCreator<Vector2> {
    constructor(name: string, private precision?: Precision) {
        super(name);
    }

    protected createVariable(ctx: WebGLRenderingContext): Variable<Vector2> {
        return new Vec2UniformVariable(ctx, this.name, this.precision);
    }
}

export function uVec2(name: string, precision?: Precision): VariableCreator<Vector2> {
    return new UVec2Creator(name, precision);
}
