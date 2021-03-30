export default abstract class WebGLBase {
    private static readonly marker = Symbol("WebGLBase.marker");
    private readonly instanceMarker = Symbol(`WebGL.instanceMarker:${this.constructor.name}`);
    private readonly ctx: WebGLRenderingContext;
    private readonly parent?: WebGLBase;
    private marker = WebGLBase.marker;
    private cleaned = false;
    private ownedChildren = new Set<WebGLBase>();
    private lastBindings = new Map<string, symbol>();

    protected constructor(parent: WebGLBase | WebGLRenderingContext) {
        if (WebGLBase.isWebGLBase(parent)) {
            this.parent = parent;
            this.ctx = parent.gl;
        } else {
            this.ctx = parent;
        }
    }

    /**
     * Returns the WebGLRenderingContext
     * @protected
     */
    protected get gl() {
        this.checkCleaned();
        return this.ctx;
    }

    private static isWebGLBase(instance: any): instance is WebGLBase {
        if (!instance) return false;
        return instance.marker === WebGLBase.marker;
    }

    /**
     * Takes the child, so that it will be cleaned up when this instance is cleaned
     * @protected
     */
    protected take(child: WebGLBase) {
        this.checkCleaned();
        if (child.parent !== this) throw new Error("Can only take direct children");
        this.ownedChildren.add(child);
    }

    /**
     * Cleans up this object and its children. No need to call if it will be done automatically
     * (i.e. only need to call if instance does not have a static lifetime)
     * @protected
     */
    protected cleanup() {
        this.checkCleaned();

        // cleanup modifies the ownedChildren set so we need to clone it first
        const ownedChildrenClone = Array.from(this.ownedChildren.keys());
        ownedChildrenClone.forEach(child => child.cleanup());

        // remove from the parent
        this.parent?.ownedChildren.delete(this);

        this.doCleanup();
    }

    /**
     * Does the actual cleanup. Override with cleanup code if needed.
     * @protected
     */
    protected doCleanup() {
    }

    /**
     * Calls `binder` if the last instance to call `target` was not `instance`
     * @protected
     */
    protected bind(binder: () => void, key: string = this.constructor.name, instance: WebGLBase = this) {
        this.checkCleaned();

        let next: WebGLBase = this;
        while (next.parent) {
            next = next.parent;
        }

        next.bindImpl(key, binder, instance);
    }

    protected forEachChild(cb: (child: WebGLBase) => void) {
        this.ownedChildren.forEach(cb);
    }

    private checkCleaned() {
        if (this.cleaned) throw new Error("Cannot use instance after it has been cleaned");
    }

    private bindImpl(key: string, binder: () => void, instance: WebGLBase) {
        // only called when this is the root instance, so there is one source of truth

        const bound = this.lastBindings.get(key) === instance.instanceMarker;
        if (bound) return;

        try {
            binder();
        } finally {
            this.lastBindings.set(key, instance.instanceMarker);
        }
    }
}
