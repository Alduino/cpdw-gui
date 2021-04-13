import DrawableNode, {CalculatedTransform, Transform, TransformCalculationInfo} from "../DrawableNode";
import Fragment from "../../../../renderer/component/Fragment";
import {GLContext} from "../../../../graphics";
import Vector2 from "@equinor/videx-vector2";
import {PaddingObject} from "../../../util/padding";

interface Props {
    padding: PaddingObject;
    direction: "horiz" | "vert";
    gap: number;
}

interface SubProps {
    fr?: number;
}

export class FlexLayoutNode extends DrawableNode<Props, SubProps, "flex"> {
    protected readonly subPrefix = "flex";

    private padding: PaddingObject;
    private direction: "horiz" | "vert";
    private gap: number;

    constructor(ctx: GLContext, props: Props) {
        super(new Fragment());
        this.applyProps(props);
    }

    applyProps(props: Props) {
        this.direction = props.direction;
        this.gap = props.gap;
        this.padding = props.padding;

        super.applyProps(props);
        this.handleTransformChanged();
    }

    protected calculateTransform(infos: TransformCalculationInfo<SubProps>[]): CalculatedTransform {
        const childTransforms: Transform[] = [];
        let totalSize = new Vector2(this.padding.left, this.padding.top);

        const maxPossibleSize = this.getParent()?.getMaximumPossibleSize() || new Vector2(Infinity);

        const maxSizeDimen = this.direction === "horiz" ? maxPossibleSize.x : maxPossibleSize.y;
        const totalFr = infos.reduce((prev, curr) => prev + (curr.subProps?.fr || 0), 0);
        const totalNonFr = infos.reduce((prev, curr) => prev + (curr.subProps.fr ? 0 : this.direction === "horiz" ? curr.requestedTransform.size.x : curr.requestedTransform.size.y), 0);
        const frSpace = maxSizeDimen - totalNonFr;
        const oneFr = frSpace / totalFr;

        for (const {requestedTransform, subProps} of infos) {
            let transform: Transform;

            if (this.direction === "horiz") {
                transform = {
                    size: subProps.fr ? new Vector2(oneFr * subProps.fr, requestedTransform.size.y) : requestedTransform.size,
                    position: new Vector2(totalSize.x, this.padding.top)
                };

                totalSize = new Vector2(
                    transform.position.x + transform.size.x + this.gap,
                    Math.max(totalSize.y, transform.size.y)
                );
            } else {
                transform = {
                    size: subProps.fr ? new Vector2(requestedTransform.size.x, oneFr * subProps.fr) : requestedTransform.size,
                    position: new Vector2(this.padding.left, totalSize.y)
                };

                totalSize = new Vector2(
                    Math.max(totalSize.x, transform.size.x),
                    transform.position.y + transform.size.y + this.gap
                );
            }

            childTransforms.push(transform);
        }

        return {
            requestedTransform: {
                position: Vector2.zero,
                size: totalSize.add(this.padding.right, this.padding.bottom)
            },
            childTransforms
        };
    }
}
