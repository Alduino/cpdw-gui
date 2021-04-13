import React, {FC} from "react";
import {intrinsic} from "../dom/intrinsic-elements";
import {vec2, Vec2} from "../utils";
import {SubPropSource, useSubPropMap} from "./subprob-map";

export interface RectangleProps {
    size?: Vec2;
}

export const Rectangle: FC<RectangleProps & SubPropSource> = ({size, ...props}) => {
    const subPropMap = useSubPropMap();

    return (
        <intrinsic.rectangle size={vec2(size, [100, 100])} {...subPropMap(props)}/>
    );
};
