import WebGLBase from "./WebGLBase";
import VertexAttribArray from "../interfaces/VertexAttribArray";
import WebGLProgram from "./WebGLProgram";
import WebGLBuffer from "./WebGLBuffer";

export default class WebGLVertexAttribArray extends WebGLBase implements VertexAttribArray {
    constructor(private program: WebGLProgram, private name: string, private valueBuffer: WebGLBuffer, private indexBuffer: WebGLBuffer) {
        super(program);
    }

    private locationCache: number;

    getLocation() {
        if (this.locationCache != null) return this.locationCache;
        this.locationCache = this.program.getAttributeLocation(this.name);
        if (this.locationCache === -1) throw new Error(`Attribute ${this.name} does not exist`);
        return this.locationCache;
    }

    activate() {
        const location = this.getLocation();

        this.valueBuffer.use();
        this.indexBuffer.use();
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location, this.valueBuffer.elemLength, this.valueBuffer.glType, false, 0, 0);
    }

    protected doCleanup() {
        const location = this.getLocation();
        this.gl.disableVertexAttribArray(location);
    }
}
