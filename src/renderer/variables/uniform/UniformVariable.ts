import Variable, {VariableLocator} from "../../Variable";
import UniformLocator from "../locators/UniformLocator";

export default abstract class UniformVariable<T> extends Variable<T> {
    protected abstract setValue(value: T, location: WebGLUniformLocation): void;

    protected createLocator(program: WebGLProgram): VariableLocator<any> {
        return new UniformLocator(this.ctx, program);
    }

    protected getQualifierKeyword(): string {
        return "uniform";
    }

    protected constructor(ctx: WebGLRenderingContext, name: string) {
        super(ctx, name);
    }

    set(value: T) {
        const location = this.getLocation();
        if (location == null) return;

        this.activateProgram();
        this.setValue(value, location);
    }
}
