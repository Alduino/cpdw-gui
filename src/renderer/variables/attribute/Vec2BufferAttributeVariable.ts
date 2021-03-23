import Vector2 from "@equinor/videx-vector2";
import BufferAttributeVariable from "./BufferAttributeVariable";
import Variable, {Precision, VariableCreator} from "../../Variable";
import KeysOfType from "../../../utils/KeysOfType";
import {BufferValue} from "../BufferVariable";

export default class Vec2BufferAttributeVariable extends BufferAttributeVariable<Vector2> {
    constructor(
        ctx: WebGLRenderingContext,
        name: string,
        usage?: GLenum,
        private precision?: Precision
    ) {
        super(ctx, name, usage);
    }

    protected getSize(): number {
        return 2;
    }

    protected getType(): GLenum {
        return this.ctx.FLOAT;
    }

    protected pack(value: Vector2[]): BufferSource {
        return new Float32Array(value.flatMap(v => v.toArray()));
    }

    protected getPrecisionKeyword(): Precision {
        return this.precision;
    }

    protected getTypeKeyword(): string {
        return "vec2";
    }
}

interface Vec2Opts {
    usage?: KeysOfType<WebGLRenderingContext, GLenum>;
    precision?: Precision;
}

class AVec2BCreator extends VariableCreator<BufferValue<Vector2>> {
    constructor(name: string, private opts: Vec2Opts) {
        super(name);
    }

    protected createVariable(ctx: WebGLRenderingContext): Variable<BufferValue<Vector2>> {
        return new Vec2BufferAttributeVariable(ctx, this.name, ctx[this.opts.usage], this.opts.precision);
    }
}

export function aVec2b(name: string, opts: Vec2Opts): VariableCreator<BufferValue<Vector2>> {
    return new AVec2BCreator(name, opts);
}
