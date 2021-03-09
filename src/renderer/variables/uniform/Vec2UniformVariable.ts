import UniformVariable from "./UniformVariable";
import Vector2 from "@equinor/videx-vector2";
import {Precision, VariableCreator} from "../../Variable";
import memoVc from "../utils/memoVc";

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

export function uVec2(name: string, precision?: Precision): VariableCreator<Vector2> {
    return memoVc(uVec2, name, ctx => new Vec2UniformVariable(ctx, name, precision));
}
