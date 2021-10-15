import Vector2 from "@equinor/videx-vector2";
import {Size, sizeToVal} from "../../util/size";
import DrawableNode, {CalculatedTransform, RequestTransformsFn} from "./DrawableNode";
import {GLContext} from "../../../graphics";
import Text from "../../../renderer/component/Text";
import {RgbaColour} from "../../utils";

export interface Props {
    value: string;
    fontSize: Size;
    colour: RgbaColour;
}

export class TextNode extends DrawableNode<Props> {
    protected readonly subPrefix: never;

    private fontSize: Size;

    constructor(ctx: GLContext, props: Props) {
        super(new Text(ctx));
        this.applyProps(props);
        this.handleTransformChanged();
    }

    applyProps(props: Props) {
        this.fontSize = props.fontSize;

        (this.drawer as Text).with(text => {
            text.text = props.value;
            text.size = new Vector2(0, sizeToVal(this.fontSize, this.getMaximumPossibleSize().y));
            text.colour = props.colour;
        });

        super.applyProps(props);
        this.handleTransformChanged();
    }

    protected calculateTransform(getRequestedTransforms: RequestTransformsFn, childCount: number, subProps: {}[], maxPossibleSize: Vector2): CalculatedTransform {
        if (childCount > 0) throw new Error("RectangleNode does not support children");

        const fontSize = sizeToVal(this.fontSize, maxPossibleSize.y);

        // TODO
        const width = 0;

        return {
            childTransforms: [],
            requestedTransform: {
                position: Vector2.zero,
                size: new Vector2(width, fontSize)
            }
        };
    }
}
