import Drawer from "./Drawer";
import Mesh, {MeshType} from "./Mesh";
import {Shader} from "./Shader";
import Program from "./Program";


export default abstract class DrawerBase implements Drawer {
    private static pack(src: number[][]) {
        const arr = src.flat();
        return new Float32Array(arr);
    }

    public static coordsAttr = "coordinates";

    private readonly ctx: WebGLRenderingContext;

    private triangleMode: GLenum;
    private indices: Uint16Array;
    private mesh: Float32Array;

    private program: Program;

    private vertexBuffer: WebGLBuffer;
    private indexBuffer: WebGLBuffer;

    private packMesh(mesh: Mesh) {
        this.mesh = DrawerBase.pack(mesh.vertices.map(v => v.toArray()));
        this.indices = mesh.indices ? new Uint16Array(mesh.indices) : null;

        switch (mesh.type) {
            case MeshType.triangles:
                this.triangleMode = this.ctx.TRIANGLES;
                break;
            case MeshType.triangleFan:
                this.triangleMode = this.ctx.TRIANGLE_FAN;
                break;
            case MeshType.triangleStrip:
                this.triangleMode = this.ctx.TRIANGLE_STRIP;
                break;
        }
    }

    private bindBufferForVariable(name: string) {
        console.debug("Binding buffer for", name);
        switch (name) {
            case DrawerBase.coordsAttr:
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
                this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                break;
            default:
                throw new Error(`No buffer for variable ${name}`);
        }
    }

    private createProgram(vs: Shader, fs: Shader) {
        this.vertexBuffer = this.createBuffer();
        this.indexBuffer = this.createBuffer();

        const program = new Program(this.ctx, vs, fs);

        program.bindBuffer = this.bindBufferForVariable.bind(this);

        program.createProgram();
        program.setupVariables();

        return program;
    }

    private createBuffer() {
        return this.ctx.createBuffer();
    }

    private updateBuffer(buff: WebGLBuffer, value: BufferSource, type: GLenum, usage: GLenum = this.ctx.STATIC_DRAW) {
        this.ctx.bindBuffer(type, buff);
        this.ctx.bufferData(type, value, usage);
    }

    protected constructor(ctx: WebGLRenderingContext, vertexShader: Shader, fragmentShader: Shader) {
        this.ctx = ctx;

        this.program = this.createProgram(vertexShader, fragmentShader);
        this.updateMesh();
    }

    public abstract calculateMesh(): Mesh;

    /**
     * Calls calculateMesh, and saves the value for `draw`
     * @protected
     */
    protected updateMesh() {
        this.packMesh(this.calculateMesh());
        this.updateBuffer(this.vertexBuffer, this.mesh, this.ctx.ARRAY_BUFFER);
        this.updateBuffer(this.indexBuffer, this.indices, this.ctx.ELEMENT_ARRAY_BUFFER);
    }

    protected setUniform(name: string, ...value: number[]) {
        this.program.setUniform(name, ...value);
    }

    draw() {
        this.program.use();
        this.ctx.drawElements(this.triangleMode, this.indices.length, this.ctx.UNSIGNED_SHORT, 0);
    }
}
