import {createContext, useContext} from "react";
import {AbsoluteLayoutSubProps} from "./layout/AbsoluteLayout";
import {SubPropIntrinsic} from "../dom/intrinsic-elements";
import DrawableNode from "../dom/nodes/DrawableNode";
import {AbsoluteLayoutNode} from "../dom/nodes/layout/AbsoluteLayoutNode";
import {FlexLayoutSubProps} from "./layout/FlexLayout";
import {FlexLayoutNode} from "../dom/nodes/layout/FlexLayoutNode";

type SubPropSourceOfBase<T, Name extends string> = { [Key in `${Name}${Capitalize<keyof T & string>}`]: T[keyof T] };
export type SubPropSourceOf<T, Base> = Base extends DrawableNode<any, any, infer Name> ? SubPropSourceOfBase<T, Name> : never;

export type SubPropSource =
    | {}
    | SubPropSourceOf<AbsoluteLayoutSubProps, AbsoluteLayoutNode>
    | SubPropSourceOf<FlexLayoutSubProps, FlexLayoutNode>;

export type SubPropMapper = (source: SubPropSource) => SubPropIntrinsic;

const context = createContext<SubPropMapper>(null);

export const SubPropMapProvider = context.Provider;
export const useSubPropMap = () => useContext(context) || (() => ({}));
