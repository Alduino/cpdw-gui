import {Transform} from "../../renderer/util/transform";

export default abstract class Node {
    protected readonly children: Node[] = [];
    protected readonly childrenIndices = new WeakMap<Node, number>();

    appendChild(child: Node) {
        const index = this.children.push(child) - 1;
        this.childrenIndices.set(child, index);
    }

    private recalculateIndicesFrom(index: number) {
        for (let i = index + 1; i < this.children.length; i++) {
            const node = this.children[i];
            this.childrenIndices.set(node, i);
        }
    }

    /**
     * This operation is expensive because we have to recalculate the indices for the following elements
     */
    insertChildBefore(beforeChild: Node, child: Node) {
        const index = this.childrenIndices.get(beforeChild);
        this.children.splice(index, 0, child);
        this.childrenIndices.set(child, index);

        this.recalculateIndicesFrom(index);
    }

    clearChildren() {
        this.children.forEach(child => child.unmount());
        this.children.length = 0;
    }

    /**
     * This operation is expensive because we have to recalculate the indices for the following elements
     */
    removeChild(child: Node) {
        child.unmount();
        const index = this.childrenIndices.get(child);
        this.children.splice(index, 1);
        this.recalculateIndicesFrom(index);
    }

    /**
     * Override if you want it to do anything. Called when this node is about to be deleted
     */
    unmount() {
    }
}
