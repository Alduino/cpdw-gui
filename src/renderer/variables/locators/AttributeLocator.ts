import {VariableLocator} from "../../Variable";

export default class AttributeLocator extends VariableLocator<number> {
    constructor(private ctx: WebGLRenderingContext, private program: WebGLProgram) {
        super();
    }

    getLocation(name: string) {
        return this.ctx.getAttribLocation(this.program, name);
    }

    hasLocation(location: number): boolean {
        return location !== -1;
    }
}
