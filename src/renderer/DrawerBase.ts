import Drawer from "./Drawer";
import {Shader, ShaderBuilder} from "./Shader";
import MeshBuilder from "./MeshBuilder";
import Variable, {VariableCache, VariableCreator} from "./Variable";
import GraphicsContext from "../graphics/interfaces/GraphicsContext";
import {GLProgram} from "../graphics";

export default abstract class DrawerBase implements Drawer {
    private static uniqueNameIncr = 0;
    private readonly variableCache: VariableCache = new Map();
    private program: GLProgram;
    private uniqueName = `${this.constructor.name}_${(++DrawerBase.uniqueNameIncr).toString(16)}`
    private disableMeshUpdate = false;

    protected constructor(private meshBuilder: MeshBuilder<DrawerBase>) {
    }

    getVariable<V extends Variable<T>, T>(from: VariableCreator<T>) {
        return from.getInstance(this.variableCache) as V;
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
        this.program.draw(this.meshBuilder.vertexCount, this.meshBuilder.triMode);
    }

    /**
     * Must be the last thing to run in the constructor
     * @protected
     */
    protected init(ctx: GraphicsContext, vertexShader: ShaderBuilder, fragmentShader: ShaderBuilder) {
        this.program = ctx.createProgram(this.uniqueName);

        const vs = new Shader(vertexShader, this.program, this.variableCache);
        const fs = new Shader(fragmentShader, this.program, this.variableCache);

        this.program.link(vs.source, fs.source);
    }

    protected updateMesh() {
        if (this.disableMeshUpdate) return;
        this.meshBuilder.build(this);
    }
}
