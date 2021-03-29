import {Shader, ShaderBuilder} from "./Shader";
import {VariableCache} from "./Variable";

export default class Program {
    program: WebGLProgram;

    constructor(
        private readonly ctx: WebGLRenderingContext,
        private readonly vs: ShaderBuilder,
        private readonly fs: ShaderBuilder,
        private readonly name: string) {}

    private loadShader(type: GLenum, source: ShaderBuilder, variableCache: VariableCache) {
        const shaderSource = new Shader(source, this.ctx, this.name, variableCache);

        const shader = this.ctx.createShader(type);
        this.ctx.shaderSource(shader, shaderSource.source);
        this.ctx.compileShader(shader);

        if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
            const log = this.ctx.getShaderInfoLog(shader);
            this.ctx.deleteShader(shader);
            console.log(shaderSource.source);
            throw new Error("Could not compile above shader: " + log);
        }

        return shader;
    }

    createProgram(variableCache: VariableCache) {
        const vertexShader = this.loadShader(this.ctx.VERTEX_SHADER, this.vs, variableCache);
        const fragmentShader = this.loadShader(this.ctx.FRAGMENT_SHADER, this.fs, variableCache);

        const program = this.ctx.createProgram();
        this.ctx.getExtension("GMAN_debug_helper")?.tagObject(program, this.name);

        this.ctx.attachShader(program, vertexShader);
        this.ctx.attachShader(program, fragmentShader);
        this.ctx.linkProgram(program);

        if (!this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS)) {
            const log = this.ctx.getProgramInfoLog(program);
            this.ctx.deleteProgram(program);
            this.ctx.deleteShader(vertexShader);
            this.ctx.deleteShader(fragmentShader);
            throw new Error("Could not link shaders: " + log);
        }

        this.program = program;

        // pass the program to each variable
        Array.from(variableCache.values()).forEach(v => v.loadProgram(this.program, this.name));
    }

    use() {
        this.ctx.useProgram(this.program);
    }
}
