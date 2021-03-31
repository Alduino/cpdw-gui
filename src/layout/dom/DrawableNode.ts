import Drawer from "../../renderer/Drawer";
import {Transform, Transformable} from "../../renderer/util/transform";
import {isMountable} from "../util/Mountable";
import Node from "./Node";
import Vector2 from "@equinor/videx-vector2";

export type TransformableDrawer = Transformable & Drawer;

type TransformWithoutViewport = Omit<Transform, "viewportSize">;

type Props = Record<string, any>;

interface TemporaryTransform {
    main: TransformWithoutViewport;

    children: TemporaryTransform[];
}

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

    /**
     * Begins a temporary transform that must end in the same tick
     * @param transform - A new position and scale relative to this one
     */
    private beginTemporaryTransform(transform: TransformWithoutViewport): TemporaryTransform {
        const dt = this.drawer.transform;

        const dto = dt.offset;

        const to = transform.offset;
        const ts = transform.scale;

        const oldOffset = dt.offset.clone();
        const oldScale = dt.scale.clone();

        const relativeOffset = new Vector2(dto.x * ts.x, dto.y * ts.y);

        dt.scale = new Vector2(dt.scale.x * transform.scale.x, dt.scale.y * transform.scale.y);
        dt.offset = to.add(relativeOffset);

        const results: TemporaryTransform[] = [];

        for (const child of this.children) {
            if (!(child instanceof DrawableNode)) throw new Error("Invalid DrawableNode child");

            const res = child.beginTemporaryTransform(dt);
            results.push(res);
        }

        return {
            main: {
                offset: oldOffset,
                scale: oldScale
            },
            children: results
        };
    }

    /**
     * Call with the return value from beginTemporaryTransform
     */
    private endTemporaryTransform(beginResult: TemporaryTransform) {
        const dt = this.drawer.transform;

        for (let i = 0; i < this.children.length; i++){
            const child = this.children[i];
            const res = beginResult.children[i];

            if (!(child instanceof DrawableNode)) throw new Error("Invalid DrawableNode child");

            child.endTemporaryTransform(res);
        }

        const {main: original} = beginResult;

        dt.scale =  original.scale;
        dt.offset = original.offset;
    }

    draw() {
        this.drawer.draw();

        for (const child of this.children) {
            if (!(child instanceof DrawableNode)) throw new Error("Invalid DrawableNode child");

            const transformRes = child.beginTemporaryTransform(this.drawer.transform);
            child.draw();
            child.endTemporaryTransform(transformRes);
        }
    }
}
