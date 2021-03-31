import {GLContext} from "../../graphics";
import Node from "./Node";
import Vector2 from "@equinor/videx-vector2";
import Rectangle from "../../renderer/component/Rectangle";
import DrawableNode, {TransformableDrawer} from "./DrawableNode";
import Text from "../../renderer/component/Text";
import {Transform} from "../../renderer/util/transform";

interface BaseProps {
    position: Vector2;
    scale: Vector2;
}

type RgbaColour = readonly [number, number, number, number];

export interface NameProps {
    rectangle: BaseProps & {
        size: Vector2;
        borderSize?: Vector2;

        fill: RgbaColour;
        borderColour: RgbaColour;
    },
    text: BaseProps & {
        fill: RgbaColour;
        value: string;
    };
}

export type NodeName = keyof NameProps;
export type NodeProps = NameProps[NodeName];

interface CreateDrawerRes {
    instance: TransformableDrawer;
    applyProps(props: NodeProps): void;
}

export default class RootNode extends Node {
    public constructor(private ctx: GLContext) {
        super();
    }

    private createDrawer(name: NodeName): CreateDrawerRes {
        switch (name) {
            case "rectangle": {
                const instance = new Rectangle(this.ctx);

                return {
                    instance,
                    applyProps: (p: NameProps["rectangle"]) => {
                        if (p.position != null) instance.transform.offset = p.position;
                        if (p.scale != null) instance.transform.scale = p.scale;

                        instance.with(i => {
                            if (p.size != null) i.size = p.size;
                            if (p.borderSize != null) i.borderSize = p.borderSize;
                            if (p.fill != null) i.fill = p.fill;
                            if (p.borderColour != null) i.borderColour = p.borderColour;
                        });
                    }
                };
            }

            case "text": {
                const instance = new Text(this.ctx);

                return {
                    instance,
                    applyProps: (p: NameProps["text"]) => {
                        if (p.position != null) instance.transform.offset = p.position;
                        if (p.scale != null) instance.transform.scale = p.scale;

                        instance.with(i => {
                            if (p.fill != null) i.colour = p.fill;
                            if (p.value != null) i.text = p.value;
                        });
                    }
                };
            }

            default:
                throw new Error(`Invalid node name, ${name}`);
        }
    }

    onResize(size: Vector2) {
        this.transform({
            viewportSize: size
        });
    }

    transform(transform: Partial<Transform>) {
        for (const child of this.children) {
            if (!(child instanceof DrawableNode)) throw new Error("Invalid DrawableNode child");
            child.transform(transform);
        }
    }

    createNode(name: NodeName, props: NodeProps) {
        const {instance, applyProps} = this.createDrawer(name);
        const node = new DrawableNode(instance, applyProps);
        node.applyProps(props);
        return node;
    }

    draw() {
        for (const child of this.children) {
            if (!(child instanceof DrawableNode)) throw new Error("Invalid DrawableNode child");
            child.draw();
        }
    }
}
