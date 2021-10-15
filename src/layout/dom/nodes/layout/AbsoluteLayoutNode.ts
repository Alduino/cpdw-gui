import Vector2 from "@equinor/videx-vector2";
import DrawableNode, {CalculatedTransform, RequestTransformsFn} from "../DrawableNode";
import Fragment from "../../../../renderer/component/Fragment";

function vecMax(a: Vector2, b: Vector2) {
    return new Vector2(
        Math.max(a.x, b.x),
        Math.max(a.y, b.y)
    );
}

interface Props {

}

interface SubProps {
    position?: Vector2;
}

export class AbsoluteLayoutNode extends DrawableNode<Props, SubProps, "absolute"> {
    protected readonly subPrefix = "absolute";

    constructor(props: Props) {
        super(new Fragment());
        this.applyProps(props);
        this.handleTransformChanged();
    }

    protected calculateTransform(requestedTransforms: RequestTransformsFn, childCount: number, subProps: SubProps[], maxPossibleSize: Vector2): CalculatedTransform {
        const childTransforms = this.requestTransformsDefault(requestedTransforms, childCount, maxPossibleSize);

        let maxSize = Vector2.zero;

        return {
            childTransforms: subProps.map((subProp, i) => {
                const transform = childTransforms[i];

                const position = subProp?.position ?? transform.position;
                const width = transform.size.x;
                const height = transform.size.y;

                if (width > maxSize.x) maxSize = new Vector2(width, maxSize.y);
                if (height > maxSize.y) maxSize = new Vector2(maxSize.x, height);

                return {
                    position,
                    size: new Vector2(width, height),
                    maxSize: maxPossibleSize
                };
            }),
            requestedTransform: {
                position: Vector2.zero,
                size: maxSize
            }
        };
    }
}
