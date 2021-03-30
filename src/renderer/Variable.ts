import {GLProgram} from "../graphics";

export type VariableCache = Map<string, Variable<any>>;

export abstract class VariableCreator<T> {
    static isVariableCreator<T>(src: any): src is VariableCreator<T> {
        return src instanceof VariableCreator;
    }

    private getKey() {
        return `${this.constructor.name}||${this.name}`;
    }

    protected abstract createVariable(ctx: GLProgram, location: number): Variable<T>;

    protected constructor(protected name: string) {}

    create(program: GLProgram, cache: VariableCache, location: number): Variable<T> {
        const key = this.getKey();
        if (cache.has(key)) return cache.get(key);

        const variable = this.createVariable(program, location);
        cache.set(key, variable);
        return variable;
    }

    getInstance(cache: VariableCache): Variable<T> {
        const key = this.getKey();
        if (!cache.has(key)) throw new Error(`Variable ${key} has not been initialised`);
        return cache.get(key);
    }
}

export type Precision = "highp" | "mediump" | "lowp";

export default abstract class Variable<T> {
    private static uniqueIdCounter = 0;

    private readonly uniqueId = Variable.uniqueIdCounter++;

    private getName() {
        // try to reduce the chance of collisions
        return `_cpdwvar_${this.uniqueId}_${this.name}`;
    }

    protected getLocation() {
        return this.location;
    }

    protected abstract getQualifierKeyword(): string;
    protected abstract getTypeKeyword(): string;
    protected abstract getPrecisionKeyword(): Precision;

    protected constructor(
        protected program: GLProgram,
        private name: string,
        private location: number
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

    abstract set(value: T): void;
}
