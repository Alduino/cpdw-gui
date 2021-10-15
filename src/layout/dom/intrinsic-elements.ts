import {FC} from "react";
import {AbsoluteLayoutNode} from "./nodes/layout/AbsoluteLayoutNode";
import DrawableNode from "./nodes/DrawableNode";
import {RectangleNode} from "./nodes/shapes/RectangleNode";
import {FlexLayoutNode} from "./nodes/layout/FlexLayoutNode";
import {TextNode} from "./nodes/TextNode";

type Constructor<T> = new (...args: any[]) => T;
type PropsOf<T> = T extends Constructor<DrawableNode<infer Props, any, any>> ? Props : never;

type NamedSubProps<Prefix extends string, SubProps> = { [Key in keyof SubProps as `${Prefix}${Capitalize<Key & string>}`]: SubProps[Key] };

type DrawableSubPropsOf<T> = T extends Constructor<DrawableNode<any, infer SubProps, any>> ? SubProps : never;
type SubPropPrefix<T> = T extends Constructor<DrawableNode<any, any, infer Prefix>> ? Prefix : never;

type AllNamedSubProps<T> = NamedSubProps<SubPropPrefix<T>, DrawableSubPropsOf<T>>;

type SubPropIdentifier<T> = {};

type IntrinsicElements<T> = {
    [Key in keyof T]: FC<PropsOf<T[Key]> & {[Key in keyof T]: AllNamedSubProps<T[Key]>}[keyof T]> & SubPropIdentifier<DrawableSubPropsOf<T[Key]>>;
};

function generateIntrinsic<T>(arg: T): IntrinsicElements<T> {
    const sourceEntries = Object.entries(arg);
    const resultEntries = sourceEntries.map(([name]) => [name, name]);
    return Object.fromEntries(resultEntries);
}

/**
 * Intrinsic elements FOR INTERNAL USE ONLY.
 * May change without warning, or break things!
 *
 * Use the wrappers provided if you want to use these.
 */
export const intrinsic = generateIntrinsic({
    layoutAbsolute: AbsoluteLayoutNode,
    layoutFlex: FlexLayoutNode,
    rectangle: RectangleNode,
    text: TextNode
});

type SubPropIntrinsicBase<T> = T extends IntrinsicElements<infer BaseType> ? {[Key in keyof BaseType]: AllNamedSubProps<BaseType[Key]>}[keyof BaseType] : never;
export type SubPropIntrinsic = SubPropIntrinsicBase<typeof intrinsic>;
export type SubPropIntrinsicOf<T> = AllNamedSubProps<T>;
