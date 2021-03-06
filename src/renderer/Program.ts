import {Shader, VariableType} from "./Shader";

export default class Program {
    private ctx: WebGLRenderingContext;
    private program: WebGLProgram;
    private readonly vs: Shader;
    private readonly fs: Shader;

    private readonly uniforms: Map<string, (...v: number[]) => void> = new Map();

    bindBuffer: (variable: string) => void;

    constructor(ctx: WebGLRenderingContext, vs: Shader, fs: Shader) {
        this.ctx = ctx;
        this.vs = vs;
        this.fs = fs;
    }

    private loadShader(type: GLenum, source: Shader) {
        const shader = this.ctx.createShader(type);
        this.ctx.shaderSource(shader, source.source);
        this.ctx.compileShader(shader);

        if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
            const log = this.ctx.getShaderInfoLog(shader);
            this.ctx.deleteShader(shader);
            source.log();
            throw new Error("Could not compile above shader: " + log);
        }

        return shader;
    }

    createProgram() {
        const vertexShader = this.loadShader(this.ctx.VERTEX_SHADER, this.vs);
        const fragmentShader = this.loadShader(this.ctx.FRAGMENT_SHADER, this.fs);

        const program = this.ctx.createProgram();
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
    }

    private getPtrTypeSize(type: VariableType) {
        const numbers = type.replace(/[^0-9]/g, "");
        return parseInt(numbers);
    }

    private getPtrGlType(type: VariableType) {
        // TODO
        return this.ctx.FLOAT;
    }

    private createAttribute(type: VariableType, name: string) {
        const location = this.ctx.getAttribLocation(this.program, name);
        const size = this.getPtrTypeSize(type);
        const glType = this.getPtrGlType(type);

        this.bindBuffer(name);
        this.ctx.vertexAttribPointer(location, size, glType, false, 0, 0);
        this.ctx.enableVertexAttribArray(location);
    }

    private createUniform(type: VariableType, name: string) {
        const location = this.ctx.getUniformLocation(this.program, name);

        switch (type) {
            case "float":
                this.uniforms.set(name, (a) => this.ctx.uniform1f(location, a));
                break;
            case "vec2":
                this.uniforms.set(name, (a, b) => this.ctx.uniform2f(location, a, b));
                break;
            case "vec3":
                this.uniforms.set(name, (a, b, c) => this.ctx.uniform3f(location, a, b, c));
                break;
            case "vec4":
                this.uniforms.set(name, (a, b, c, d) => this.ctx.uniform4f(location, a, b, c, d));
                break;
            default:
                throw new Error(`Type ${type} is not supported`);
        }
    }

    private setupAttributes() {
        for (const attribute of this.vs.attributes) {
            this.createAttribute(attribute.type, attribute.name);
        }
    }

    private setupUniforms() {
        for (const uniform of this.vs.uniforms) {
            this.createUniform(uniform.type, uniform.name);
        }

        for (const uniform of this.fs.uniforms) {
            if (!this.uniforms.has(uniform.name))
                this.createUniform(uniform.type, uniform.name);
        }
    }

    setupVariables() {
        this.setupAttributes();
        this.setupUniforms();
    }

    setUniform(name: string, ...values: number[]) {
        if (!this.uniforms.has(name)) throw new Error(`Uniform ${name} does not exist, or is not set correctly.

Always use \${["uniform", "type", "name"]} when creating a uniform.`);

        this.use();
        this.uniforms.get(name)(...values);
    }

    use() {
        this.ctx.useProgram(this.program);
    }
}
