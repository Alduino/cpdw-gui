import Vector2 from "@equinor/videx-vector2";
import {EventEmitter} from "events";
import {WindowWrapper} from "../WindowWrapper";
import {start} from "repl";

export class BrowserWindow extends EventEmitter implements WindowWrapper {
    /**
     * Class names used for each element of the window
     */
    public static classNames = {
        // this element is used for window resizing, but always exists. cursor is overridden.
        // must be position: absolute!
        windowContainerContainer: "window-container-container",
        // the container of the window
        windowContainer: "window-container",
        // class added while the window is moving
        windowMoving: "moving",
        // the window has a border
        windowBordered: "with-border",
        // bar at the top of the widow
        titleBar: "title-bar",
        // text in the title bar
        title: "title-bar-label",
        // actual window display
        canvas: "canvas",
        // overlay across entire display for movement events
        displayMovementOverlay: "window-movement-overlay",
        // enable easing for resizing, used when toggling maximised mode. used on both container-container and container
        easedResizeEnabled: "eased-resize-enabled"
    };

    private container: HTMLElement;
    private innerContainer: HTMLElement;
    private canvas: HTMLCanvasElement;
    private titleBar: HTMLElement;
    private titleLabel: HTMLElement;
    private lastGlAttrs?: WebGLContextAttributes;
    private borderlessState = false;
    private maximisedState = false;
    private context: WebGLRenderingContext;
    private isOpenVal: boolean;

    get maximised() {
        return this.maximisedState;
    }

    get ctx() {
        return this.context;
    }

    get borderless() {
        return this.borderlessState;
    }

    set borderless(val) {
        this.borderlessState = val;
        this.close();
        this.open(this.lastGlAttrs);
    }

    get isOpen() {
        return this.isOpenVal;
    }

    get closing() {
        return !this.isOpen;
    }

    constructor(public display: HTMLElement) {
        super();
    }

    close() {
        this.container.remove();
        this.container = null;
    }

    private move(initE: MouseEvent, onMove: (pos: Vector2, initialPos: Vector2, cover: HTMLElement) => void) {
        const movingCover = document.createElement("div");
        movingCover.className = BrowserWindow.classNames.displayMovementOverlay;
        this.display.appendChild(movingCover);

        const start = new Vector2(initE.pageX - movingCover.offsetLeft, initE.pageY - movingCover.offsetTop);

        onMove(Vector2.zero, start, movingCover);

        movingCover.addEventListener("mousemove", e => {
            const mousePos = new Vector2(e.pageX - movingCover.offsetLeft, e.pageY - movingCover.offsetTop);
            onMove(mousePos.sub(start), start, movingCover);
        });

        return new Promise<void>(yay => {
            movingCover.addEventListener("mouseup", () => {
                movingCover.remove();
                yay();
            });
        });
    }

    private static edge(relativePos: Vector2, size: Vector2, padding = 15) {
        const {x, y} = relativePos;
        const {x: ix, y: iy} = size.sub(relativePos);

        // corners
        if (x < padding && y < padding) return "nw";
        if (ix < padding && y < padding) return "ne";
        if (x < padding && iy < padding) return "sw";
        if (ix < padding && iy < padding) return "se";

        const {x: nx, y: ny} = new Vector2(relativePos.x / size.x, relativePos.y / size.y);
        const {x: inx, y: iny} = new Vector2(1 - nx, 1 - ny);

        // sides
        if (nx < .5 && nx < ny && nx < iny) return "w";
        if (inx < .5 && inx < ny && inx < iny) return "e";
        if (ny < .5 && ny < nx && ny < inx) return "n";
        if (iny < .5 && iny < nx && iny < inx) return "s";
    }

    open(glAttrs?: WebGLContextAttributes) {
        const containerContainer = document.createElement("div");
        containerContainer.className = BrowserWindow.classNames.windowContainerContainer;
        this.container = containerContainer;

        containerContainer.addEventListener("mousemove", ev => {
            if (ev.target !== containerContainer) {
                containerContainer.style.cursor = "";
                return;
            }

            const relativePos = new Vector2(
                ev.pageX - containerContainer.offsetLeft - container.offsetLeft,
                ev.pageY - containerContainer.offsetTop - container.offsetTop
            );

            const edge = BrowserWindow.edge(relativePos, this.size);
            containerContainer.style.cursor = `${edge}-resize`;
        });

        containerContainer.addEventListener("mousedown", e => {
            if (e.target !== containerContainer) return;

            e.preventDefault();
            container.classList.add(BrowserWindow.classNames.windowMoving);
            const startPos = this.pos;
            const startSize = this.size;
            this.move(e, (pos, initialPos, cover) => {
                const relativePos = pos.add(initialPos).sub(startPos);
                const edge = BrowserWindow.edge(initialPos.sub(startPos), startSize);
                cover.style.cursor = `${edge}-resize`;

                this.resizeBy(edge, startPos, startSize, relativePos);
            }).then(() => {
                container.classList.remove(BrowserWindow.classNames.windowMoving);
            });
        });

        const container = document.createElement("div");
        this.innerContainer = container;
        container.className = BrowserWindow.classNames.windowContainer;

        if (!this.borderlessState) {
            container.classList.add(BrowserWindow.classNames.windowBordered);
            const titleBar = document.createElement("div");
            this.titleBar = titleBar;
            titleBar.className = BrowserWindow.classNames.titleBar;

            const title = document.createElement("div");
            this.titleLabel = title;
            title.className = BrowserWindow.classNames.title;
            title.textContent = this.title;
            titleBar.appendChild(title);

            titleBar.addEventListener("mousedown", e => {
                e.preventDefault();

                const startMoving = () => {
                    clearTimeout(timeout);
                    titleBar.removeEventListener("mouseup", handleMouseUp);
                    titleBar.removeEventListener("mousemove", handleMouseMove);

                    container.classList.add(BrowserWindow.classNames.windowMoving);
                    const startPos = this.pos;
                    this.move(e, pos => {
                        this.pos = pos.add(startPos);
                    }).then(() => {
                        container.classList.remove(BrowserWindow.classNames.windowMoving);
                    });
                };

                const handleMouseUp = () => {
                    titleBar.removeEventListener("mouseup", handleMouseUp);
                    titleBar.removeEventListener("mousemove", handleMouseMove);
                    clearTimeout(timeout);
                }

                const handleMouseMove = () => {
                    titleBar.removeEventListener("mouseup", handleMouseUp);
                    titleBar.removeEventListener("mousemove", handleMouseMove);
                    startMoving();
                }

                const timeout = setTimeout(() => {
                    startMoving();
                }, 150);

                titleBar.addEventListener("mouseup", handleMouseUp);
                titleBar.addEventListener("mousemove", handleMouseMove);
            });

            titleBar.addEventListener("dblclick", () => {
                if (this.maximised) this.restore();
                else this.maximise();
            });

            container.appendChild(titleBar);
        }

        const canvas = document.createElement("canvas");
        canvas.className = BrowserWindow.classNames.canvas;
        this.canvas = canvas;
        this.context = canvas.getContext("webgl", {
            alpha: false,
            ...glAttrs
        });
        this.lastGlAttrs = glAttrs;
        container.appendChild(canvas);

        containerContainer.appendChild(container);
        this.display.appendChild(containerContainer);

        this.isOpenVal = true;
    }

    private tempTitle = "Untitled Window";

    get title() {
        if (this.isOpen) return this.titleLabel.textContent;
        return this.tempTitle;
    }

    set title(val) {
        if (this.isOpen) this.titleLabel.textContent = val;
        else this.tempTitle = val;
    }

    get pos() {
        return new Vector2(
            this.container.offsetLeft + this.innerContainer.offsetLeft,
            this.container.offsetTop + this.innerContainer.offsetTop
        );
    }

    set pos(val) {
        if (this.maximised) this.restore();

        this.container.style.left = `${val.x - this.innerContainer.offsetLeft}px`;
        this.container.style.top = `${Math.max(val.y, 0) - this.innerContainer.offsetTop}px`;
    }

    get screenSize() {
        return new Vector2(this.container.parentElement.offsetWidth, this.container.parentElement.offsetHeight);
    }

    get size() {
        return new Vector2(this.innerContainer.clientWidth, this.innerContainer.clientHeight);
    }

    set size(val) {
        if (this.maximised) this.restore();

        this.innerContainer.style.width = `${Math.max(70, val.x)}px`;
        this.innerContainer.style.height = `${Math.max(this.titleBar.offsetHeight + 5, val.y)}px`;

        this.canvas.width = val.x;
        this.canvas.height = val.y - this.titleBar.offsetHeight;
    }

    cancelAnimationFrame(id: number) {
        cancelAnimationFrame(id);
    }

    requestAnimationFrame(cb: () => void) {
        return requestAnimationFrame(cb);
    }

    private nonMaximisedPos: Vector2;
    private nonMaximisedSize: Vector2;

    maximise() {
        if (this.maximised) return;

        this.nonMaximisedPos = this.pos;
        this.nonMaximisedSize = this.size;

        this.innerContainer.classList.add(BrowserWindow.classNames.easedResizeEnabled);
        this.container.classList.add(BrowserWindow.classNames.easedResizeEnabled);

        this.pos = Vector2.zero;
        this.size = new Vector2(this.display.offsetWidth, this.display.offsetHeight);

        this.maximisedState = true;

        const that = this;
        this.innerContainer.addEventListener("transitionend", function handleResizeComplete() {
            that.innerContainer.removeEventListener("transitionend", handleResizeComplete);

            that.innerContainer.classList.remove(BrowserWindow.classNames.easedResizeEnabled);
            that.container.classList.remove(BrowserWindow.classNames.easedResizeEnabled);
        });
    }

    restore() {
        if (!this.maximised) return;

        this.maximisedState = false;

        this.innerContainer.classList.add(BrowserWindow.classNames.easedResizeEnabled);
        this.container.classList.add(BrowserWindow.classNames.easedResizeEnabled);

        this.pos = this.nonMaximisedPos;
        this.size = this.nonMaximisedSize;

        const that = this;
        this.innerContainer.addEventListener("transitionend", function handleResizeComplete() {
            that.innerContainer.removeEventListener("transitionend", handleResizeComplete);

            that.innerContainer.classList.remove(BrowserWindow.classNames.easedResizeEnabled);
            that.container.classList.remove(BrowserWindow.classNames.easedResizeEnabled);
        });
    }

    private resizeBy(edge: string, initPos: Vector2, initSize: Vector2, relativePos: Vector2) {
        if (edge.startsWith("n")) {
            // top edge
            this.size = new Vector2(this.size.x, initSize.y - relativePos.y);
            this.pos = new Vector2(this.pos.x, initPos.y).add(new Vector2(0, initSize.y - this.size.y));
        } else if (edge.startsWith("s")) {
            // bottom edge
            this.size = new Vector2(this.size.x, relativePos.y);
        }

        if (edge.endsWith("e")) {
            // right edge
            this.size = new Vector2(relativePos.x, this.size.y);
        } else if (edge.endsWith("w")) {
            // left edge
            this.size = new Vector2(initSize.x - relativePos.x, this.size.y);
            this.pos = new Vector2(initPos.x, this.pos.y).add(new Vector2(initSize.x - this.size.x, 0));
        }
    }
}
