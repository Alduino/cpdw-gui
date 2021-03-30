import Program, {DrawType} from "../interfaces/Program";
import {BufferElementType, BufferType} from "../interfaces/Buffer";
import WebGLGraphicsContext from "./WebGLGraphicsContext";
import WebGLBase from "./WebGLBase";
import {BrowserProgram} from "./browser-types";
import WebGLBuffer, {BufferUsage} from "./WebGLBuffer";
import WebGLShader, {ShaderType} from "./WebGLShader";
import {UniformType} from "../interfaces/Uniform";
import {WebGLUniformF1} from "./uniforms/WebGLUniformF1";
import {WebGLUniformF2} from "./uniforms/WebGLUniformF2";
import {WebGLUniformF3} from "./uniforms/WebGLUniformF3";
import {WebGLUniformF4} from "./uniforms/WebGLUniformF4";
import WebGLUniform from "./WebGLUniform";
import WebGLVertexAttribArray from "./WebGLVertexAttribArray";
import WebGLTexture from "./WebGLTexture";
import debug from "../../debug-log";

export default class WebGLProgram extends WebGLBase implements Program {
    private readonly glProgram: BrowserProgram;

    constructor(parent: WebGLGraphicsContext, public readonly name: string) {
        super(parent);

        this.glProgram = this.gl.createProgram();
    }

    createVertexAttribArray(name: string, valueBuffer: WebGLBuffer, indexBuffer: WebGLBuffer) {
        const vaa = new WebGLVertexAttribArray(this, name, valueBuffer, indexBuffer);
        this.take(vaa);
        return vaa;
    }

    getAttributeLocation(name: string) {
        return this.gl.getAttribLocation(this.glProgram, name);
    }

    getUniformLocation(name: string) {
        return this.gl.getUniformLocation(this.glProgram, name);
    }

    createUniform(type: UniformType, name: string, location: number) {
        const instance = this.createUniformInstance(type, name);
        this.take(instance);
        return instance;
    }

    link(vertexShaderSource: string, fragmentShaderSource: string) {
        const vertexShader = new WebGLShader(this, ShaderType.vertex, vertexShaderSource);
        const fragmentShader = new WebGLShader(this, ShaderType.fragment, fragmentShaderSource);

        vertexShader.compile();
        fragmentShader.compile();

        vertexShader.attachTo(this.glProgram);
        fragmentShader.attachTo(this.glProgram);

        this.gl.linkProgram(this.glProgram);

        if (!this.gl.getProgramParameter(this.glProgram, this.gl.LINK_STATUS)) {
            const log = this.gl.getProgramInfoLog(this.glProgram);

            this.cleanup();

            throw new Error(`Could not link shaders: ${log}`);
        }
    }

    enableExtension(name: string) {
        debug("WebGLProgram", `Enabling extension ${name}`)
        this.gl.getExtension(name);
    }

    createBuffer(type: BufferType, elemType: BufferElementType, usage: BufferUsage = BufferUsage.static) {
        const buffer = new WebGLBuffer(this, type, elemType, usage);
        this.take(buffer);
        return buffer;
    }

    createTexture() {
        const texture = new WebGLTexture(this);
        this.take(texture);
        return texture;
    }

    draw(vertexCount: number, type: DrawType): void {
        this.activate();
        this.use();
        this.gl.drawElements(this.getGlDrawType(type), vertexCount, this.gl.UNSIGNED_SHORT, 0);
    }

    activate() {
        this.bind(() => {
            this.gl.useProgram(this.glProgram);
        }, "WebGLProgram:activate");
    }

    protected doCleanup() {
        this.gl.deleteProgram(this.glProgram);
    }

    private getGlDrawType(src: DrawType) {
        switch (src) {
            case DrawType.triangles:
                return this.gl.TRIANGLES;
            case DrawType.triangleFan:
                return this.gl.TRIANGLE_FAN;
            case DrawType.triangleStrip:
                return this.gl.TRIANGLE_STRIP;
            default:
                throw new Error("Invalid draw type");
        }
    }

    private createUniformInstance(type: UniformType, name: string): WebGLUniform<any> {
        switch (type) {
            case UniformType.f1:
                return new WebGLUniformF1(this, name);
            case UniformType.f2:
                return new WebGLUniformF2(this, name);
            case UniformType.f3:
                return new WebGLUniformF3(this, name);
            case UniformType.f4:
                return new WebGLUniformF4(this, name);
            default:
                throw new Error(`Invalid uniform type, ${UniformType[type] || type}, for ${name}`);
        }
    }

    private use() {
        this.bind(() => {
            this.forEachChild(child => {
                if (child instanceof WebGLVertexAttribArray) {
                    child.activate();
                } else if (child instanceof WebGLBuffer) {
                    child.use();
                }
            });
        });
    }
}
