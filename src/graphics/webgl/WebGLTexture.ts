import WebGLBase from "./WebGLBase";
import Texture from "../interfaces/Texture";
import Vector2 from "@equinor/videx-vector2";
import WebGLProgram from "./WebGLProgram";
import {BrowserTexture} from "./browser-types";

export default class WebGLTexture extends WebGLBase implements Texture {
    private readonly glTexture: BrowserTexture;

    constructor(program: WebGLProgram) {
        super(program);

        this.glTexture = this.gl.createTexture();
    }

    private setOptions() {
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    }

    writeRgba(data: Uint8Array, size: Vector2): void {
        this.use();

        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0,
            this.gl.RGBA, size.x, size.y, 0,
            this.gl.RGBA, this.gl.UNSIGNED_BYTE,
            data
        );

        this.setOptions();
    }

    use() {
        this.bind(() => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.glTexture);
        });
    }
}
