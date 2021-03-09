export type VariableCache = Map<string, Variable<any>>;
export type VariableCreator<T> = (ctx: WebGLRenderingContext, cache: VariableCache) => Variable<T>;

export type Precision = "highp" | "mediump" | "lowp";

export abstract class VariableLocator<T> {
    abstract getLocation(name: string): T;
    abstract hasLocation(location: T): boolean;
}

export default abstract class Variable<T> {
    private locator: VariableLocator<any>;
    private program: WebGLProgram;

    private getName() {
        // try to reduce the chance of collisions
        return `_var_${this.constructor.name}_${this.name}`;
    }

    protected onProgramSet: (() => void)[] = [];

    protected getLocation() {
        if (!this.locator) throw new Error("Locator has not been loaded yet. Wait until the Program has been constructed.");
        const location = this.locator.getLocation(this.getName());

        if (!this.locator.hasLocation(location)) {
            console.warn(`${this.getQualifierKeyword()} ${this.name} does not exist in shader. It may have been optimised out, or was not present in the source.`);
            return null;
        }

        return location;
    }

    protected activateProgram() {
        this.ctx.useProgram(this.program);
    }

    protected abstract getQualifierKeyword(): string;
    protected abstract getTypeKeyword(): string;
    protected abstract getPrecisionKeyword(): Precision;

    protected abstract createLocator(program: WebGLProgram): VariableLocator<any>;

    protected constructor(
        protected ctx: WebGLRenderingContext,
        private name: string
    ) {}

    getCreator(): string {
        const res: string[] = [];

        res.push(this.getQualifierKeyword());
        if (this.getPrecisionKeyword()) return this.getPrecisionKeyword();
        res.push(this.getTypeKeyword());
        res.push(this.getName());

        return res.join(" ");
    }

    getAccessor() {
        return this.getName();
    }

    loadProgram(program: WebGLProgram) {
        this.program = program;
        this.locator = this.createLocator(program);
        this.onProgramSet.forEach(v => v());
    }

    abstract set(value: T): void;
}
