import * as Uniforms from "../../interfaces/uniforms";
import WebGLProgram from "../WebGLProgram";
import WebGLUniform from "../WebGLUniform";

export class WebGLUniformF1 extends WebGLUniform<[number]> implements Uniforms.f1 {
    constructor(program: WebGLProgram, name: string) {
        super(program, name);

    }

    setValue(...value: [number]): void {
        this.gl.uniform1f(this.getLocation(), ...value);
    }
}
