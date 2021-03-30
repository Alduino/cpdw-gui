import * as Uniforms from "../../interfaces/uniforms";
import WebGLProgram from "../WebGLProgram";
import WebGLUniform from "../WebGLUniform";

export class WebGLUniformF3 extends WebGLUniform<[number, number, number]> implements Uniforms.f3 {
    constructor(program: WebGLProgram, name: string) {
        super(program, name);

    }

    setValue(...value: [number, number, number]): void {
        this.gl.uniform3f(this.getLocation(), ...value);
    }
}
