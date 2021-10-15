import Vector2 from "@equinor/videx-vector2";
import DrawableNode, {CalculatedTransform, RequestTransformsFn} from "../DrawableNode";
import Rectangle from "../../../../renderer/component/Rectangle";
import {GLContext} from "../../../../graphics";
import {Size2, sizeToVec} from "../../../util/size";

export interface Props {
    size: Size2;
}

export class RectangleNode extends DrawableNode<Props> {
    protected readonly subPrefix: never;

    private size: Size2;

    constructor(ctx: GLContext, props: Props) {
        super(new Rectangle(ctx));
        this.applyProps(props);
        this.handleTransformChanged();
    }

    applyProps(props: Props): void {
        this.size = props.size;
        super.applyProps(props);
        this.handleTransformChanged();
    }

    protected calculateTransform(requestTransforms: RequestTransformsFn, childCount: number, subProps: {}[], maxPossibleSize: Vector2): CalculatedTransform {
        if (childCount > 0) throw new Error("RectangleNode does not support children");

        const size = sizeToVec(this.size, maxPossibleSize);

        return {
            childTransforms: [],
            requestedTransform: {
                position: Vector2.zero,
                size
            }
        };
    }
}

export {Props as RectangleNodeProps};
