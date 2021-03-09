import {VariableLocator} from "../../Variable";

export default class UniformLocator extends VariableLocator<WebGLUniformLocation> {
    constructor(private ctx: WebGLRenderingContext, private program: WebGLProgram) {
        super();
    }

    getLocation(name: string) {
        return this.ctx.getUniformLocation(this.program, name);
    }

    hasLocation(location: WebGLUniformLocation): boolean {
        return location !== null;
    }
}
