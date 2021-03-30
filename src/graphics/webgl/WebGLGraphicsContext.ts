import GraphicsContext from "../interfaces/GraphicsContext";
import Program from "../interfaces/Program";
import WebGLProgram from "./WebGLProgram";
import WebGLBase from "./WebGLBase";

export default class WebGLGraphicsContext extends WebGLBase implements GraphicsContext {
    public fromCanvas(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("webgl");
        return new WebGLGraphicsContext(ctx);
    }

    constructor(ctx: WebGLRenderingContext) {
        super(ctx);
    }

    createProgram(name: string): Program {
        const program = new WebGLProgram(this, name);
        this.take(program);
        return program;
    }
}
