import * as Uniforms from "../../interfaces/uniforms";
import WebGLProgram from "../WebGLProgram";
import WebGLUniform from "../WebGLUniform";

export class WebGLUniformF4 extends WebGLUniform<[number, number, number, number]> implements Uniforms.f4 {
    constructor(program: WebGLProgram, name: string) {
        super(program, name);
    }

    setValue(...value: [number, number, number, number]): void {
        this.gl.uniform4f(this.getLocation(), ...value);
    }
}
