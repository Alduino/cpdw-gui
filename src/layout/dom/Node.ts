import EventEmitter from "events";
import Vector2 from "@equinor/videx-vector2";

/**
 * Called after a child is added
 */
export const EVENT_CHILD_ADDED = "childAdded" as const;

/**
 * Called before a child is removed
 */
export const EVENT_CHILD_REMOVED = "childRemoved" as const;

/**
 * Called after the parent has been set
 */
export const EVENT_PARENT_SET = "parentSet" as const;

export default abstract class Node extends EventEmitter {
    private readonly children: Node[] = [];
    private readonly childrenIndices = new WeakMap<Node, number>();
    private parent: Node | null;

    appendChild(child: Node) {
        child.parent = this;
        const index = this.children.push(child) - 1;
        this.childrenIndices.set(child, index);
        this.emit(EVENT_CHILD_ADDED, child);
        child.emit(EVENT_PARENT_SET);
    }

    /**
     * This operation is expensive because we have to recalculate the indices for the following elements
     */
    insertChildBefore(beforeChild: Node, child: Node) {
        if (beforeChild.parent !== this) throw new Error("beforeChild is not a child of this node");

        child.parent = this;

        const index = this.childrenIndices.get(beforeChild);
        this.children.splice(index, 0, child);
        this.childrenIndices.set(child, index);

        this.recalculateIndicesFrom(index);

        this.emit(EVENT_CHILD_ADDED, child);
        child.emit(EVENT_PARENT_SET);
    }

    clearChildren() {
        this.children.forEach(child => {
            this.emit(EVENT_CHILD_REMOVED, child);
            child.unmount();
            child.parent = null;
        });
        this.children.length = 0;
    }

    /**
     * This operation is expensive because we have to recalculate the indices for the following elements
     */
    removeChild(child: Node) {
        this.emit(EVENT_CHILD_REMOVED, child);
        child.unmount();
        child.parent = null;
        const index = this.childrenIndices.get(child);
        this.children.splice(index, 1);
        this.recalculateIndicesFrom(index);
    }

    getChildren() {
        return this.children.slice();
    }

    getParent() {
        return this.parent;
    }

    /**
     * Override if you want it to do anything. Called when this node is about to be deleted
     */
    unmount() {
    }

    private recalculateIndicesFrom(index: number) {
        for (let i = index + 1; i < this.children.length; i++) {
            const node = this.children[i];
            this.childrenIndices.set(node, i);
        }
    }

    abstract getMaximumPossibleSize(): Vector2;
}
