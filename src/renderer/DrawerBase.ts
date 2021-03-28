import Drawer from "./Drawer";
import {ShaderBuilder} from "./Shader";
import Program from "./Program";
import MeshBuilder, {MeshType} from "./MeshBuilder";
import Variable, {VariableCache, VariableCreator} from "./Variable";
import {isBindable} from "./variables/Bindable";

export default abstract class DrawerBase implements Drawer {
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

    private readonly variableCache: VariableCache = new Map();

    private readonly ctx: WebGLRenderingContext;
    private program: Program;

    private static uniqueNameIncr = 0;
    private uniqueName = `${this.constructor.name}_${(++DrawerBase.uniqueNameIncr).toString(16)}`

    private createProgram(vs: ShaderBuilder, fs: ShaderBuilder) {
        const program = new Program(this.ctx, vs, fs, this.uniqueName);
        program.createProgram(this.variableCache);

        return program;
    }

    private createBuffer() {
        return this.ctx.createBuffer();
    }

    private updateBuffer(buff: WebGLBuffer, value: BufferSource, type: GLenum, usage: GLenum = this.ctx.STATIC_DRAW) {
        this.ctx.bindBuffer(type, buff);
        this.ctx.bufferData(type, value, usage);
    }

    protected constructor(ctx: WebGLRenderingContext, private meshBuilder: MeshBuilder<DrawerBase>) {
        this.ctx = ctx;
    }

    /**
     * Must be the last thing to run in the constructor
     * @protected
     */
    protected init(vertexShader: ShaderBuilder, fragmentShader: ShaderBuilder) {
        this.program = this.createProgram(vertexShader, fragmentShader);
        this.updateMesh();
    }

    private disableMeshUpdate = false;
    protected updateMesh() {
        if (this.disableMeshUpdate) return;
        this.meshBuilder.build(this);
    }

    getVariable<V extends Variable<T>, T>(from: VariableCreator<T>): V {
        return from.create(this.ctx, this.uniqueName, this.variableCache) as V;
    }

    /**
     * Allows setting multiple properties that would update the mesh, with only one mesh update at the end
     * @param withExpr - Update the properties in this callback
     */
    with(withExpr: (setters: this) => void) {
        this.disableMeshUpdate = true;
        withExpr(this);
        this.disableMeshUpdate = false;

        this.updateMesh();
    }

    draw() {
        this.program.use();

        const bindableVariables = Array.from(this.variableCache.values())
            .filter(isBindable)
            .map(v => isBindable(v) ? v : null);

        bindableVariables.forEach(v => v.bind());

        const drawType = DrawerBase.getDrawType(this.ctx, this.meshBuilder.triMode);
        this.ctx.drawElements(drawType, this.meshBuilder.vertexCount, this.ctx.UNSIGNED_SHORT, 0);

        bindableVariables.forEach(v => v.unbind());
    }
}
