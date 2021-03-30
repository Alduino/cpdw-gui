import BufferAttributeVariable from "./BufferAttributeVariable";
import Variable, {Precision, VariableCreator} from "../../Variable";
import {BufferValue} from "../BufferVariable";
import {Vec4} from "../../util/Vec4";
import {BufferElementType, GLProgram} from "../../../graphics";

export default class Vec4BufferAttributeVariable extends BufferAttributeVariable<Vec4> {
    constructor(
        program: GLProgram,
        name: string,
        location: number,
        private precision?: Precision
    ) {
        super(program, name, location, BufferElementType.f4);
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
    precision?: Precision;
}

class AVec4BCreator extends VariableCreator<BufferValue<Vec4>> {
    constructor(name: string, private opts: Vec4Opts) {
        super(name);
    }

    protected createVariable(program: GLProgram, location: number): Variable<BufferValue<Vec4>> {
        return new Vec4BufferAttributeVariable(program, this.name, location, this.opts.precision);
    }
}

export function aVec4b(name: string, opts: Vec4Opts): VariableCreator<BufferValue<Vec4>> {
    return new AVec4BCreator(name, opts);
}
