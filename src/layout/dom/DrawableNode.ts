import Drawer from "../../renderer/Drawer";
import {Transform, Transformable} from "../../renderer/util/transform";
import {isMountable} from "../util/Mountable";
import Node from "./Node";

export type TransformableDrawer = Transformable & Drawer;

type Props = Record<string, any>;

export default class DrawableNode extends Node {
    constructor(private drawer: TransformableDrawer, private applyPropsCb: (props: Props) => void) {
        super();
    }

    applyProps(props: Props) {
        this.applyPropsCb(props);
    }

    unmount() {
        if (isMountable(this.drawer)) this.drawer.unmount();
    }

    transform(transform: Partial<Transform>) {
        if (transform.viewportSize) this.drawer.transform.viewportSize = transform.viewportSize;
        if (transform.scale) this.drawer.transform.scale = transform.scale;
        if (transform.offset) this.drawer.transform.offset = transform.offset;

        for (const child of this.children) {
            if (!(child instanceof DrawableNode)) throw new Error("Invalid DrawableNode child");
            child.transform(transform);
        }
    }

    draw() {
        this.drawer.draw();

        for (const child of this.children) {
            if (!(child instanceof DrawableNode)) throw new Error("Invalid DrawableNode child");
            child.draw();
        }
    }
}
