import Variable, {Precision, VariableCreator, VariableLocator} from "../../Variable";
import Bindable, {bindableSymbol} from "../Bindable";
import Vector2 from "@equinor/videx-vector2";
import UPNG from "@pdf-lib/upng";

class NoopLocator extends VariableLocator<any> {
    getLocation(name: string): any {
        return true;
    }

    hasLocation(location: any): boolean {
        return true;
    }
}

export default class ImageTexture2dVariable extends Variable<ArrayBuffer> implements Bindable {
    [bindableSymbol]: true;
    private readonly texture: WebGLTexture;

    constructor(ctx: WebGLRenderingContext, name: string) {
        super(ctx, name);
        this[bindableSymbol] = true;
        this.texture = this.ctx.createTexture();
        this.setData(new Uint8Array([255, 0, 255, 255]), new Vector2(1, 1));
    }

    set(value: ArrayBuffer): void {
        this.load(value);
    }

    bind(): void {
        this.ctx.activeTexture(this.ctx.TEXTURE0);
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
    }

    unbind(): void {
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
    }

    protected createLocator(program: WebGLProgram): VariableLocator<any> {
        return new NoopLocator();
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

    private setData(data: ArrayBufferView, size: Vector2) {
        this.bind();
        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0,
            this.ctx.RGBA, size.x, size.y, 0,
            this.ctx.RGBA, this.ctx.UNSIGNED_BYTE,
            data);
    }

    private setImage(image: TexImageSource) {
        this.bind();
        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0,
            this.ctx.RGBA, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE,
            image);
    }

    private setOptions() {
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR);
    }

    private load(source: ArrayBuffer) {
        // fill with loading colour while loading
        this.setData(new Uint8Array([255, 0, 255, 255]), new Vector2(1, 1));
        this.setOptions();
        const image = UPNG.decode(source);
        const rgba8 = UPNG.toRGBA8(image);
        if (rgba8.length !== 1) throw new Error("Image must be a PNG file with one frame");
        const [firstImage] = rgba8;
        this.setData(new Uint8Array(firstImage), new Vector2(image.width, image.height));
        this.setOptions();
    }
}

class Tex2dCreator extends VariableCreator<ArrayBuffer> {
    constructor(name: string) {
        super(name);
    }

    protected createVariable(ctx: WebGLRenderingContext): Variable<ArrayBuffer> {
        return new ImageTexture2dVariable(ctx, this.name);
    }
}

export function tex2d(name: string): VariableCreator<ArrayBuffer> {
    return new Tex2dCreator(name);
}
