import BufferAttributeVariable from "./BufferAttributeVariable";
import {Precision, VariableCreator} from "../../Variable";
import KeysOfType from "../../../utils/KeysOfType";
import {BufferValue} from "../BufferVariable";
import memoVc from "../utils/memoVc";

export type Vec4 = [number, number, number, number];

export default class Vec4BufferAttributeVariable extends BufferAttributeVariable<Vec4> {
    constructor(
        ctx: WebGLRenderingContext,
        name: string,
        usage?: GLenum,
        private precision?: Precision
    ) {
        super(ctx, name, usage);
    }

    protected getSize(): number {
        return 4;
    }

    protected getType(): GLenum {
        return this.ctx.FLOAT;
    }

    protected pack(value: Vec4[]): BufferSource {
        return new Float32Array(value.flat());
    }

    protected getPrecisionKeyword(): Precision {
        return this.precision;
    }

    protected getTypeKeyword(): string {
        return "vec4";
    }
}

interface Vec4Opts {
    usage?: KeysOfType<WebGLRenderingContext, GLenum>;
    precision?: Precision;
}

export function aVec4b(name: string, opts: Vec4Opts): VariableCreator<BufferValue<Vec4>> {
    return memoVc(aVec4b, name, ctx => new Vec4BufferAttributeVariable(ctx, name, ctx[opts.usage], opts.precision));
}
