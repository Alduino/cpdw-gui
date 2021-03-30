import Variable, {Precision, VariableCreator} from "../../Variable";
import Vector2 from "@equinor/videx-vector2";
import UPNG from "@pdf-lib/upng";
import {GLProgram, GLTexture} from "../../../graphics";

export default class ImageTexture2dVariable extends Variable<ArrayBuffer> {
    private texture: GLTexture;

    constructor(program: GLProgram, name: string, location: number) {
        super(program, name, location);

        this.texture = this.program.createTexture();
        this.texture.writeRgba(new Uint8Array([255, 0, 255, 255]), new Vector2(1, 1));
    }

    set(value: ArrayBuffer): void {
        this.load(value);
    }

    protected getPrecisionKeyword(): Precision {
        return undefined;
    }

    protected getQualifierKeyword(): string {
        return "uniform";
    }

    protected getTypeKeyword(): string {
        return "sampler2D";
    }

    private load(source: ArrayBuffer) {
        const image = UPNG.decode(source);
        const rgba8 = UPNG.toRGBA8(image);
        if (rgba8.length !== 1) throw new Error("Image must be a PNG file with one frame");
        const [firstImage] = rgba8;
        this.texture.writeRgba(new Uint8Array(firstImage), new Vector2(image.width, image.height));
    }
}

class Tex2dCreator extends VariableCreator<ArrayBuffer> {
    constructor(name: string) {
        super(name);
    }

    protected createVariable(program: GLProgram, location: number): Variable<ArrayBuffer> {
        return new ImageTexture2dVariable(program, this.name, location);
    }
}

export function tex2d(name: string): VariableCreator<ArrayBuffer> {
    return new Tex2dCreator(name);
}
