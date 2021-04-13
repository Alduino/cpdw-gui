import Vector2 from "@equinor/videx-vector2";
import DrawableNode, {CalculatedTransform, TransformCalculationInfo} from "../DrawableNode";
import Rectangle from "../../../../renderer/component/Rectangle";
import {GLContext} from "../../../../graphics";

export interface Props {
    size: Vector2;
}

export class RectangleNode extends DrawableNode<Props> {
    protected readonly subPrefix: never;

    private size: Vector2;

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

    protected calculateTransform(infos: TransformCalculationInfo[]): CalculatedTransform {
        return {
            childTransforms: [],
            requestedTransform: {
                position: Vector2.zero,
                size: this.size
            }
        };
    }
}

export {Props as RectangleNodeProps};
