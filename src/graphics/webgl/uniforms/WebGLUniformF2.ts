import * as Uniforms from "../../interfaces/uniforms";
import WebGLProgram from "../WebGLProgram";
import WebGLUniform from "../WebGLUniform";

export class WebGLUniformF2 extends WebGLUniform<[number, number]> implements Uniforms.f2 {
    constructor(program: WebGLProgram, name: string) {
        super(program, name);
    }

    setValue(...value: [number, number]): void {
        this.gl.uniform2f(this.getLocation(), ...value);
    }
}
