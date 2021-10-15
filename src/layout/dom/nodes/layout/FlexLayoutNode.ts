import DrawableNode, {
    CalculatedTransform, ChildTransformInfo,
    RequestTransformsFn
} from "../DrawableNode";
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

    getMaximumPossibleSize(): Vector2 {
        return super.getMaximumPossibleSize().sub(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);
    }

    protected calculateTransform(requestTransforms: RequestTransformsFn, childCount: number, subProps: SubProps[], maxPossibleSize: Vector2): CalculatedTransform {
        const maxPossibleSizePadded = maxPossibleSize.sub(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);
        const childTransformRequests = this.requestTransformsDefault(requestTransforms, childCount, maxPossibleSizePadded);

        const infos = subProps.map((subProps, i) => ({subProps, requestedTransform: childTransformRequests[i]}));

        const maxSizeDimen = this.direction === "horiz" ? maxPossibleSizePadded.x : maxPossibleSizePadded.y;

        // total number of fr units
        const totalFr = subProps.reduce((prev, curr) => prev + (curr?.fr || 0), 0);

        // total width of all non-fr children in px
        const totalNonFr = infos.reduce((prev, curr) => prev + this.gap + (curr.subProps?.fr ? 0 : this.direction === "horiz" ? curr.requestedTransform.size.x : curr.requestedTransform.size.y), -this.gap);

        const frSpace = maxSizeDimen - totalNonFr;

        // the amount of pixels that 1fr is equal to
        const oneFr = frSpace / totalFr;

        const childTransforms: ChildTransformInfo[] = [];
        let totalSize = new Vector2(this.padding.left, this.padding.top);

        for (const {requestedTransform, subProps} of infos) {
            let transform: ChildTransformInfo;

            if (this.direction === "horiz") {
                transform = {
                    size: subProps?.fr ? new Vector2(oneFr * subProps.fr, requestedTransform.size.y) : requestedTransform.size,
                    maxSize: subProps?.fr ? new Vector2(oneFr * subProps.fr, maxPossibleSizePadded.y) : maxPossibleSizePadded,
                    position: new Vector2(totalSize.x, this.padding.top)
                };

                totalSize = new Vector2(
                    transform.position.x + transform.size.x + this.gap,
                    Math.max(totalSize.y, transform.size.y)
                );
            } else {
                transform = {
                    size: subProps.fr ? new Vector2(requestedTransform.size.x, oneFr * subProps.fr) : requestedTransform.size,
                    maxSize: subProps.fr ? new Vector2(maxPossibleSizePadded.x, oneFr * subProps.fr) : maxPossibleSizePadded,
                    position: new Vector2(this.padding.left, totalSize.y + this.gap)
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
