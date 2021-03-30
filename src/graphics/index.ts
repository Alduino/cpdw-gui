export {default as GLContext} from "./interfaces/GraphicsContext";
export {default as GLProgram, DrawType} from "./interfaces/Program";
export {default as GLBuffer, BufferType, BufferElementType} from "./interfaces/Buffer";
export {default as GLTexture} from "./interfaces/Texture";
export {default as GLUniform, UniformType} from "./interfaces/Uniform";
export {default as GLShader} from "./interfaces/Shader";

import * as GLUniforms from "./interfaces/uniforms";
export {GLUniforms};

export {default as WebGLImpl} from "./webgl/WebGLGraphicsContext";
