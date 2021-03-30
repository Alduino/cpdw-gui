import Variable, {VariableCache, VariableCreator} from "./Variable";
import KeysOfType from "../utils/KeysOfType";
import {GLProgram} from "../graphics";

export class Shader {
    private static format(source: string) {
        const addIndentRegex = /[{(]/g,
            removeIndentRegex = /[})]/g;

        const lines = source.split("\n").map(l => l.trim());
        const result: string[] = [];

        let indent = 0, previousLine = "";
        for (const line of lines) {
            if (!line && !previousLine) continue;

            const addIndentCount = line.match(addIndentRegex)?.length || 0;
            const removeIndentCount = line.match(removeIndentRegex)?.length || 0;
            const diff = addIndentCount - removeIndentCount;

            if (diff < 0) indent += diff;
            result.push(" ".repeat(Math.max(0, indent) * 4) + line);
            if (diff > 0) indent += diff;

            previousLine = line;
        }

        return result.join("\n");
    }

    private readonly src: string;

    public readonly variables: Variable<any>[];

    constructor(builder: ShaderBuilder, program: GLProgram, variableCache: VariableCache) {
        builder.build(program, variableCache);
        this.src = builder.getResult();
        this.variables = builder.variables;
    }

    get source() {
        return Shader.format(this.src);
    }
}

export interface ShaderBuilder {
    readonly variables: Variable<any>[];

    // only available after build()
    readonly program: GLProgram;
    readonly variableCache: VariableCache;

    build(program: GLProgram, variableCache: VariableCache): void;

    getResult(): string;
}

class OperationRunner {
    constructor(private sb: ShaderBuilder) {
    }

    private nextVariableLocation = 0;
    var(_: "var", creator: VariableCreator<any>) {
        const variable = creator.create(this.sb.program, this.sb.variableCache, this.nextVariableLocation++);
        this.sb.variables.push(variable);
        return variable.getCreator();
    }

    ref(_: "ref", creator: VariableCreator<any>) {
        // running the creator again is not ideal, but there is a memo utility that they can use to make it faster
        // (and to make sure it returns the same variable instance)
        const variable = creator.getInstance(this.sb.variableCache);
        return variable.getAccessor();
    }

    include(_: "include", shader: ShaderBuilder) {
        shader.build(this.sb.program, this.sb.variableCache);
        this.sb.variables.push(...shader.variables);
        return shader.getResult();
    }

    extension(_: "extension", name: string) {
        this.sb.program.enableExtension(name);
        return `# extension GL_${name} : enable`;
    }
}

type OpKeys = KeysOfType<typeof OperationRunner.prototype, Function>;
type Operation = Parameters<{ [key in OpKeys]: typeof OperationRunner.prototype[key] }[OpKeys]>;

class ShaderBuilderImpl implements ShaderBuilder {
    private readonly strings: TemplateStringsArray;
    private readonly ops: (Operation | VariableCreator<unknown> | string)[];
    private readonly opRunner: OperationRunner;

    // reset each build
    private result: string[] = [];
    program: GLProgram;
    variableCache: VariableCache;
    variables: Variable<any>[];

    constructor(strings: TemplateStringsArray, opts: (Operation | VariableCreator<unknown> | string)[]) {
        this.strings = strings;
        this.ops = opts;
        this.opRunner = new OperationRunner(this);
    }

    runOperation(op: Operation) {
        // @ts-ignore
        return this.opRunner[op[0]](...op);
    }

    build(ctx: GLProgram, variableCache: VariableCache) {
        this.result = [];
        this.program = ctx;
        this.variableCache = variableCache;
        this.variables = [];

        for (let i = 0; i < this.ops.length; i++) {
            const str = this.strings[i];
            const op = this.ops[i];

            this.result.push(str);

            if (typeof op === "string") this.result.push(op);
            else if (VariableCreator.isVariableCreator(op)) this.result.push(this.runOperation(["ref", op]))
            else this.result.push(this.runOperation(op));
        }

        this.result.push(this.strings[this.ops.length]);
    }

    getResult() {
        return this.result.join("");
    }
}

export default function createShader(strings: TemplateStringsArray, ...ops: (Operation | VariableCreator<unknown> | string)[]) {
    return new ShaderBuilderImpl(strings, ops);
}
