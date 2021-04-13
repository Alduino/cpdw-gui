type PaddingLeftRight = {
    paddingLeft?: number;
    paddingRight?: number;
};

type PaddingXOnly = {
    paddingX?: number;
};

type PaddingTopBottom = {
    paddingTop?: number;
    paddingBottom?: number;
};

type PaddingYOnly = {
    paddingY?: number;
};

type PaddingOnly = {
    padding?: number;
};

function isPaddingLeftRight(src: PaddingX): src is PaddingLeftRight {
    return "paddingLeft" in src || "paddingRight" in src;
}

function isPaddingXOnly(src: PaddingX): src is PaddingXOnly {
    return "paddingX" in src;
}

function isPaddingTopBottom(src: PaddingY): src is PaddingTopBottom {
    return "paddingTop" in src || "paddingBottom" in src;
}

function isPaddingYOnly(src: PaddingY): src is PaddingYOnly {
    return "paddingY" in src;
}

function isPaddingOnly(src: Padding): src is PaddingOnly {
    return "padding" in src;
}

type PaddingX = PaddingXOnly | PaddingLeftRight;
type PaddingY = PaddingYOnly | PaddingTopBottom;

export type Padding = PaddingOnly | (PaddingX & PaddingY);

export interface PaddingObject {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export function resolvePadding(src: Padding): PaddingObject {
    let top = 0, bottom = 0, left = 0, right = 0;

    if (isPaddingOnly(src)) {
        top = bottom = left = right = src.padding || 0;
    } else {
        if (isPaddingXOnly(src)) {
            left = right = src.paddingX || 0;
        } else if (isPaddingLeftRight(src)) {
            left = src.paddingLeft || 0;
            right = src.paddingRight || 0;
        }

        if (isPaddingYOnly(src)) {
            top = bottom = src.paddingY || 0;
        } else if (isPaddingTopBottom(src)) {
            top = src.paddingTop || 0;
            bottom = src.paddingBottom || 0;
        }
    }

    return {top, bottom, left, right};
}
