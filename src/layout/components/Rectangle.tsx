import React, {FC} from "react";
import {intrinsic} from "../dom/intrinsic-elements";
import {size2, Size2Bases} from "../utils";
import {SubPropSource, useSubPropMap} from "./subprob-map";

export interface RectangleProps {
    size?: Size2Bases;
}

export const Rectangle: FC<RectangleProps & SubPropSource> = ({size, ...props}) => {
    const subPropMap = useSubPropMap();

    return (
        <intrinsic.rectangle size={size2(size, [100, 100])} {...subPropMap(props)}/>
    );
};
