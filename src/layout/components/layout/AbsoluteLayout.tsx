import React, {FC} from "react";
import {intrinsic, SubPropIntrinsicOf} from "../../dom/intrinsic-elements";
import {vec2, Vec2} from "../../utils";
import {AbsoluteLayoutNode} from "../../dom/nodes/layout/AbsoluteLayoutNode";
import {SubPropMapProvider, SubPropSource, SubPropSourceOf, useSubPropMap} from "../subprob-map";

export interface AbsoluteLayoutProps {
}

export interface AbsoluteLayoutSubProps {
    position: Vec2;
}

function convSubProps(input: SubPropSourceOf<AbsoluteLayoutSubProps, AbsoluteLayoutNode>): SubPropIntrinsicOf<typeof AbsoluteLayoutNode> {
    return {
        absolutePosition: vec2(input.absolutePosition)
    };
}

export const AbsoluteLayout: FC<AbsoluteLayoutProps & SubPropSource> = ({children, ...props}) => {
    const subPropMap = useSubPropMap();

    return (
        <intrinsic.layoutAbsolute {...subPropMap(props)}>
            <SubPropMapProvider value={convSubProps}>
                {children}
            </SubPropMapProvider>
        </intrinsic.layoutAbsolute>
    );
};
