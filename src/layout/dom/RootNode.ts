import Vector2 from "@equinor/videx-vector2";
import {FC} from "react";
import {GLContext} from "../../graphics";
import Node from "./Node";
import DrawableNode from "./nodes/DrawableNode";
import {intrinsic} from "./intrinsic-elements";
import {AbsoluteLayoutNode} from "./nodes/layout/AbsoluteLayoutNode";
import {RectangleNode} from "./nodes/shapes/RectangleNode";
import {FlexLayoutNode} from "./nodes/layout/FlexLayoutNode";

type PropsOf<T> = T extends FC<infer Props> ? Props : never;
type IntrinsicElements = typeof intrinsic;
type IT<Name extends keyof IntrinsicElements> = PropsOf<IntrinsicElements[Name]>;

export default class RootNode extends Node {
    private viewportSize: Vector2;

    public constructor(private ctx: GLContext) {
        super();
    }

    getMaximumPossibleSize(): Vector2 {
        return this.viewportSize;
    }

    setViewportSize(size: Vector2) {
        this.viewportSize = size;
        for (const child of this.getChildren()) {
            if (!(child instanceof DrawableNode)) throw new Error("Invalid DrawableNode child");
            child.setViewportSize(size);
        }
    }

    createNode<Name extends keyof IntrinsicElements>(name: Name, props: IT<Name>) {
        switch (name) {
            case "layoutAbsolute":
                return new AbsoluteLayoutNode();
            case "layoutFlex":
                return new FlexLayoutNode(this.ctx, props as IT<"layoutFlex">);
            case "rectangle":
                return new RectangleNode(this.ctx, props as IT<"rectangle">);
            default:
                throw new Error(`${name} is not an intrinsic element`);
        }
    }

    draw() {
        for (const child of this.getChildren()) {
            if (!(child instanceof DrawableNode))
                throw new Error(`Invalid child \`${child?.constructor.name ?? "null"}\``);
            child.draw();
        }
    }
}
