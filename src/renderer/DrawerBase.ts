import Drawer from "./Drawer";
import {Shader} from "./Shader";
import Program from "./Program";
import MeshBuilder, {MeshType} from "./MeshBuilder";

export default abstract class DrawerBase<T extends DrawerBase<T, TAttrs>, TAttrs extends string> implements Drawer {
    private static getDrawType(ctx: WebGLRenderingContext, from: MeshType) {
        switch (from) {
            case MeshType.triangles:
                return ctx.TRIANGLES;
            case MeshType.triangleFan:
                return ctx.TRIANGLE_FAN;
            case MeshType.triangleStrip:
                return ctx.TRIANGLE_STRIP;
        }
    }

    private readonly ctx: WebGLRenderingContext;
    private program: Program;

    private attributeBuffers: Record<TAttrs, WebGLBuffer>;

    private bindBufferForVariable(name: string) {
        console.debug("Binding buffer for", name);

        const attributes = Object.entries(this.meshBuilder.attributeNames)
            .filter(([, value]) => value === name)
            .map(([key]) => key) as TAttrs[];

        if (attributes.length === 0) {
            const availableAttrs = Object.values(this.meshBuilder.attributeNames).join(", ");
            throw new Error(`Attribute ${name} does not exist.\n\nAvailable attributes: ${availableAttrs}`);
        }

        for (const attribute of attributes) {
            const buffer = this.attributeBuffers[attribute];
            const type = this.meshBuilder.attributeTypes[attribute];
            this.ctx.bindBuffer(this.ctx[type], buffer);
        }
    }

    private createMeshBuffers() {
        const bufferEntries = Object.keys(this.meshBuilder.attributeTypes)
            .map(key => [key, this.createBuffer()] as [TAttrs, WebGLBuffer]);
        this.attributeBuffers = Object.fromEntries(bufferEntries) as Record<TAttrs, WebGLBuffer>;
    }

    private createProgram(vs: Shader, fs: Shader) {
        this.createMeshBuffers();

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

    protected constructor(ctx: WebGLRenderingContext, private meshBuilder: MeshBuilder<TAttrs, T>) {
        this.ctx = ctx;
    }

    /**
     * Must be the last thing to run in the constructor
     * @protected
     */
    protected init(vertexShader: Shader, fragmentShader: Shader) {
        this.program = this.createProgram(vertexShader, fragmentShader);
        this.updateMesh();
        console.log(this.attributeBuffers);
    }

    protected setUniform(name: string, ...value: number[]) {
        this.program.setUniform(name, ...value);
    }

    protected updateMesh() {
        // this isn't necessarily assignable to T, but that is the whole point of T so we will assume it here
        this.meshBuilder.build(this as unknown as T);

        // update the buffers
        const entries = Object.entries(this.meshBuilder.attributeValues) as [TAttrs, BufferSource][];
        for (const [key, value] of entries) {
            this.updateBuffer(this.attributeBuffers[key], value, this.ctx[this.meshBuilder.attributeTypes[key]]);
        }
    }

    draw() {
        this.program.use();

        const drawType = DrawerBase.getDrawType(this.ctx, this.meshBuilder.triMode);
        this.ctx.drawElements(drawType, this.meshBuilder.vertexCount, this.ctx.UNSIGNED_SHORT, 0);
    }
}
