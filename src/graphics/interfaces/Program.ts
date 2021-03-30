import Buffer, {BufferElementType, BufferType} from "./Buffer";
import Uniform, {UniformType} from "./Uniform";
import VertexAttribArray from "./VertexAttribArray";
import * as Uniforms from "./uniforms";
import Texture from "./Texture";

export enum DrawType {
    triangles,
    triangleFan,
    triangleStrip
}

export default interface Program {
    readonly name: string;

    link(vertexSource: string, fragmentSource: string): void;
    enableExtension(name: string): void;

    draw(vertexCount: number, type: DrawType): void;

    createBuffer(type: BufferType, elemType: BufferElementType): Buffer;
    createTexture(): Texture;

    createVertexAttribArray(name: string, valueBuffer: Buffer, indexBuffer: Buffer): VertexAttribArray;

    createUniform(type: UniformType.f1, name: string, location: number): Uniforms.f1;
    createUniform(type: UniformType.f2, name: string, location: number): Uniforms.f2;
    createUniform(type: UniformType.f3, name: string, location: number): Uniforms.f3;
    createUniform(type: UniformType.f4, name: string, location: number): Uniforms.f4;
    createUniform(type: UniformType, name: string, location: number): Uniform<any>;
}
