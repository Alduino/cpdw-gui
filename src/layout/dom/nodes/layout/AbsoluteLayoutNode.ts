import Vector2 from "@equinor/videx-vector2";
import DrawableNode, {CalculatedTransform, TransformCalculationInfo} from "../DrawableNode";
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
    position: Vector2;
}

export class AbsoluteLayoutNode extends DrawableNode<Props, SubProps, "absolute"> {
    protected readonly subPrefix = "absolute";

    constructor() {
        super(new Fragment());
        this.applyProps({});
        this.handleTransformChanged();
    }

    protected calculateTransform(infos: TransformCalculationInfo<SubProps>[]): CalculatedTransform {
        const maxSize = infos
            .reduce((prev, curr) => vecMax(prev, curr.requestedTransform.size), Vector2.zero);

        return {
            requestedTransform: {
                position: Vector2.zero,
                size: maxSize
            },
            childTransforms: infos.map(item => {
                if (item.subProps?.position) {
                    return {
                        position: item.subProps.position,
                        size: item.requestedTransform.size
                    };
                }

                return item.requestedTransform;
            })
        };
    }
}
