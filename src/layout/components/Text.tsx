import React, {FC} from "react";
import {SizeString} from "../util/size";
import {SubPropSource, useSubPropMap} from "./subprob-map";
import {intrinsic} from "../dom/intrinsic-elements";
import {colour as convColour, Colour, size} from "../utils";
import Color from "color";

export interface TextProps {
    value: string;
    colour?: Colour;
    fontSize?: SizeString;
}

export const Text: FC<TextProps & SubPropSource> = ({fontSize, value, colour, ...props}) => {
    const subPropMap = useSubPropMap();

    return (
        <intrinsic.text fontSize={size(fontSize, 16)} colour={convColour(colour, new Color("black"))} value={value} {...subPropMap(props)} />
    );
};
