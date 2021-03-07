export class Shader {
    public readonly source: string;

    public readonly attributes: Variable[];
    public readonly uniforms: Variable[];

    constructor(builder: ShaderBuilder) {
        this.source = builder.result.join("");
        this.attributes = builder.attributes;
        this.uniforms = builder.uniforms;
    }

    log() {
        let indent = 0;
        const lines = this.source.split("\n").slice(1, -1);

        /*const firstLine = lines[0];
        for (let i = 0; i < firstLine.length; i++) {
            if (firstLine[i] !== " ") break;
            indent++;
        }*/

        const unindentedLines = lines.map((l, i) => `${i + 1}. ${l.substring(indent)}`);
        console.log(unindentedLines.join("\n"));
    }
}

export type VariableType = "float" | "vec2" | "vec3" | "vec4";
type Precision = "highp" | "mediump" | "lowp";

type AttributeInitOp = Parameters<typeof ShaderBuilder.prototype.runAttrOperation>;
type UniformInitOp = Parameters<typeof ShaderBuilder.prototype.runUniformOperation>;
type IncludeOp = Parameters<typeof ShaderBuilder.prototype.runInclude>;

type Operation = AttributeInitOp | UniformInitOp | IncludeOp;

export interface Variable {
    type: VariableType;
    name: string;
}

class ShaderBuilder {
    private readonly strings: TemplateStringsArray;
    private readonly ops: (Operation | string)[];

    readonly result: string[] = [];

    readonly attributes: Variable[] = [];
    readonly uniforms: Variable[] = [];

    constructor(strings: TemplateStringsArray, opts: (Operation | string)[]) {
        this.strings = strings;
        this.ops = opts;
    }

    runAttrOperation(_: "attr", type: VariableType, name: string) {
        this.attributes.push({type,  name});
        return `attribute ${type} ${name}`;
    }

    runUniformOperation(_: "uniform", type: VariableType, name: string, precision?: Precision) {
        this.uniforms.push({type, name});

        if (precision) return `uniform ${precision} ${type} ${name}`;
        return `uniform ${type} ${name}`;
    }

    runInclude(_: "include", value: Shader) {
        this.attributes.push(...value.attributes);
        this.uniforms.push(...value.uniforms);
        return value.source;
    }

    runOperation(op: Operation) {
        switch (op[0]) {
            case "attr": return this.runAttrOperation(...op);
            case "uniform": return this.runUniformOperation(...op);
            case "include": return this.runInclude(...op);
            default: throw new Error(`Unsupported operation "${op[0]}"`);
        }
    }

    createShader() {
        for (let i = 0; i < this.ops.length; i++) {
            const str = this.strings[i];
            const op = this.ops[i];

            this.result.push(str);

            if (typeof op === "string") this.result.push(op);
            else this.result.push(this.runOperation(op));
        }

        this.result.push(this.strings[this.ops.length]);

        return new Shader(this);
    }
}

export default function createShader(strings: TemplateStringsArray, ...ops: (Operation | string)[]) {
    const builder = new ShaderBuilder(strings, ops);
    return builder.createShader();
}
