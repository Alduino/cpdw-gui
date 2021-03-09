import Vector2 from "@equinor/videx-vector2";
import BufferAttributeVariable from "./BufferAttributeVariable";
import {Precision, VariableCreator} from "../../Variable";
import KeysOfType from "../../../utils/KeysOfType";
import {BufferValue} from "../BufferVariable";
import memoVc from "../utils/memoVc";

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

export function aVec2b(name: string, opts: Vec2Opts): VariableCreator<BufferValue<Vector2>> {
    return memoVc(aVec2b, name, ctx => new Vec2BufferAttributeVariable(ctx, name, ctx[opts.usage], opts.precision));
}
