import BufferAttributeVariable from "./BufferAttributeVariable";
import Variable, {Precision, VariableCreator} from "../../Variable";
import KeysOfType from "../../../utils/KeysOfType";
import {BufferValue} from "../BufferVariable";

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

class AVec4BCreator extends VariableCreator<BufferValue<Vec4>> {
    constructor(name: string, private opts: Vec4Opts) {
        super(name);
    }

    protected createVariable(ctx: WebGLRenderingContext): Variable<BufferValue<Vec4>> {
        return new Vec4BufferAttributeVariable(ctx, this.name, ctx[this.opts.usage], this.opts.precision);
    }
}

export function aVec4b(name: string, opts: Vec4Opts): VariableCreator<BufferValue<Vec4>> {
    return new AVec4BCreator(name, opts);
}
