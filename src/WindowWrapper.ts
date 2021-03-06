import Vector2 from "@equinor/videx-vector2";
import EventEmitterInterface = NodeJS.EventEmitter;

type OnEvent<This, Name extends string | symbol, Args extends any[] = []> = (event: Name, listener: (...args: Args) => void) => This;

export interface WindowWrapper extends EventEmitterInterface {
    title: string;
    pos: Vector2;
    size: Vector2;
    readonly drawSize: Vector2;
    readonly screenSize: Vector2;
    readonly closing: boolean;
    readonly ctx: WebGLRenderingContext;

    requestAnimationFrame(cb: () => void): number;
    cancelAnimationFrame(id: number): void;

    on:
        OnEvent<this, "blur" | "focus" | "focusin" | "focusout", [FocusEvent]> |
        OnEvent<this, "click" | "mousedown" | "mouseenter" | "mouseleave" | "mouseup", [MouseEvent]> |
        OnEvent<this, "drop", [DragEvent]> |
        OnEvent<this, "resize", [{width: number, height: number}]> |
        OnEvent<this, "iconify"> |
        OnEvent<this, "keydown" | "keyup", [KeyboardEvent]> |
        OnEvent<this, "quit"> |
        OnEvent<this, "refresh"> |
        OnEvent<this, "wresize", [{width: number, height: number}]> |
        OnEvent<this, "wheel", [WheelEvent]> |
        OnEvent<this, "move", [{x: number, y: number}]>
    ;
}

