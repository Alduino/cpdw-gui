import {NameProps} from "./RootNode";
import {PropsWithChildren} from "react";

export const i = {
    rectangle: ('rectangle' as any) as ((
        _: PropsWithChildren<NameProps["rectangle"]>
    ) => JSX.Element),
    text: ('text' as any) as ((
        _: NameProps["text"]
    ) => JSX.Element)
};
