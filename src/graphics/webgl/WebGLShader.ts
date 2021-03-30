import WebGLBase from "./WebGLBase";
import Shader from "../interfaces/Shader";
import {BrowserProgram, BrowserShader} from "./browser-types";

export enum ShaderType {
    vertex,
    fragment
}

export default class WebGLShader extends WebGLBase implements Shader {
    private glShader: BrowserShader;

    constructor(parent: WebGLBase, private type: ShaderType, private source: string) {
        super(parent);
    }

    private get glType() {
        switch (this.type) {
            case ShaderType.vertex:
                return this.gl.VERTEX_SHADER;
            case ShaderType.fragment:
                return this.gl.FRAGMENT_SHADER;
            default:
                throw new Error("Invalid shader type");
        }
    }

    compile() {
        this.glShader = this.gl.createShader(this.glType);
        this.gl.shaderSource(this.glShader, this.source);
        this.gl.compileShader(this.glShader);

        if (!this.gl.getShaderParameter(this.glShader, this.gl.COMPILE_STATUS)) {
            const log = this.gl.getShaderInfoLog(this.glShader);

            this.cleanup();

            throw new Error(`Could not compile shader: ${log}
[Source]:
${this.source}`);
        }
    }

    attachTo(program: BrowserProgram) {
        this.gl.attachShader(program, this.glShader);
    }

    protected doCleanup() {
        this.gl.deleteShader(this.glShader);
    }
}
