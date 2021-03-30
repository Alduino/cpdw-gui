import Vector2 from "@equinor/videx-vector2";
import BufferAttributeVariable from "./BufferAttributeVariable";
import Variable, {Precision, VariableCreator} from "../../Variable";
import {BufferValue} from "../BufferVariable";
import {BufferElementType, GLProgram} from "../../../graphics";

export default class Vec2BufferAttributeVariable extends BufferAttributeVariable<Vector2> {
    constructor(
        program: GLProgram,
        name: string,
        location: number,
        private precision?: Precision
    ) {
        super(program, name, location, BufferElementType.f2);
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
    precision?: Precision;
}

class AVec2BCreator extends VariableCreator<BufferValue<Vector2>> {
    constructor(name: string, private opts: Vec2Opts) {
        super(name);
    }

    protected createVariable(program: GLProgram, location: number): Variable<BufferValue<Vector2>> {
        return new Vec2BufferAttributeVariable(program, this.name, location, this.opts.precision);
    }
}

export function aVec2b(name: string, opts: Vec2Opts): VariableCreator<BufferValue<Vector2>> {
    return new AVec2BCreator(name, opts);
}
