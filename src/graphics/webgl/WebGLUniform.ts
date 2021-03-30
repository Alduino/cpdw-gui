import WebGLBase from "./WebGLBase";
import Uniform from "../interfaces/Uniform";
import WebGLProgram from "./WebGLProgram";

export default abstract class WebGLUniform<TParams extends unknown[]> extends WebGLBase implements Uniform<TParams> {
    protected constructor(private program: WebGLProgram, private name: string) {
        super(program);
        if (typeof name !== "string") throw new TypeError("Name must be a string");
    }

    private _locationCache: WebGLUniformLocation;

    getLocation() {
        if (this._locationCache != null) return this._locationCache;
        this._locationCache = this.program.getUniformLocation(this.name);
        return this._locationCache;
    }

    abstract setValue(...value: TParams): void;

    set(...value: TParams) {
        this.program.activate();
        this.setValue(...value);
    }
}
