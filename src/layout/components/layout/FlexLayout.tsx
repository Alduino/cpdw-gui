import React, {FC} from "react";
import {SubPropMapProvider, SubPropSource, SubPropSourceOf, useSubPropMap} from "../subprob-map";
import {FlexLayoutNode} from "../../dom/nodes/layout/FlexLayoutNode";
import {intrinsic, SubPropIntrinsicOf} from "../../dom/intrinsic-elements";
import {Padding, resolvePadding} from "../../util/padding";

interface FlexLayoutPropsBase {
    direction: "horiz" | "vert";
    gap?: number;
}

export type FlexLayoutProps = FlexLayoutPropsBase & Padding;

export interface FlexLayoutSubProps {
    fr?: number;
}

function convSubProps(input: SubPropSourceOf<FlexLayoutSubProps, FlexLayoutNode>): SubPropIntrinsicOf<typeof FlexLayoutNode> {
    return {
        flexFr: input.flexFr
    };
}

export const FlexLayout: FC<FlexLayoutProps & SubPropSource> = ({direction, gap, children, ...props}) => {
    const subPropMap = useSubPropMap();

    return (
        <intrinsic.layoutFlex
            padding={resolvePadding(props)}
            direction={direction}
            gap={gap || 0}
            {...subPropMap(props)}
        >
            <SubPropMapProvider value={convSubProps}>
                {children}
            </SubPropMapProvider>
        </intrinsic.layoutFlex>
    );
};
