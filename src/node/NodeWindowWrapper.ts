import {EventEmitter} from "events";
import {Window as NodeWindow} from "glfw-raub";
import webgl from "webgl-raub";
import Vector2 from "@equinor/videx-vector2";
import {WindowWrapper} from "../WindowWrapper";

export class NodeWindowWrapper extends EventEmitter implements WindowWrapper {
    constructor(private window: NodeWindow) {
        super();

        this.ctx = webgl;
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

    get title() {
        return this.window.title;
    }

    set title(val) {
        this.window.title = val;
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
