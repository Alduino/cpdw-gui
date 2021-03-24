import {EventEmitter} from "events";
import {Document as NodeDocument, WindowMode} from "glfw-raub";
import webgl from "webgl-raub";
import Vector2 from "@equinor/videx-vector2";
import {WindowWrapper} from "../WindowWrapper";

NodeDocument.setWebgl(webgl);

export class NodeWindowWrapper extends EventEmitter implements WindowWrapper {
    private initEventListeners() {
        this.window.on("resize", ({width, height}) => this.emit("resize", new Vector2(width, height)));

        this.on("resize", size => this.ctx.viewport(0, 0, size.x, size.y));
    }

    constructor(private window: NodeDocument) {
        super();
        this.ctx = webgl;
        webgl.enable(webgl.BLEND);
        webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);
        this.initEventListeners();
    }

    readonly ctx: WebGLRenderingContext;

    get pos() {
        return new Vector2(this.window.x, this.window.y);
    }

    set pos(val) {
        this.window.x = val.x;
        this.window.y = val.y;
    }

    get screenSize() {
        const monitor = this.window.getCurrentMonitor();
        return new Vector2(monitor.width, monitor.height);
    }

    get size() {
        return new Vector2(this.window.width, this.window.height);
    }

    set size(val) {
        this.window.width = val.x;
        this.window.height = val.y;
    }

    get drawSize() {
        return this.size;
    }

    get title() {
        return this.window.title;
    }

    set title(val) {
        this.window.title = val;
    }

    get borderless() {
        return this.window.mode === WindowMode.Borderless;
    }

    set borderless(state) {
        if (state) this.window.mode = WindowMode.Borderless;
        else this.window.mode = WindowMode.Windowed;
    }

    get closing() {
        return this.window.shouldClose;
    }

    cancelAnimationFrame(id: number) {
        this.window.cancelAnimationFrame(id);
    }

    requestAnimationFrame(cb: () => void) {
        return this.window.requestAnimationFrame(cb);
    }
}
