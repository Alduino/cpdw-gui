import Vector2 from "@equinor/videx-vector2";

type NumberSizeString<Postfix extends string> = `${number}${Postfix}` | `${number}.${number}${Postfix}`;

type PxPostfix = "px";
type PercentPostfix = "%";

type Postfixes = PxPostfix | PercentPostfix;
type XSize<Postfix> = {type: Postfix, value: number};

export type SizeString = NumberSizeString<Postfixes>;
export type Size = XSize<Postfixes>;

export type Size2 = {x: Size, y: Size};

const getSizeRegex = /^(\d+(?:\.\d+)?)(.+)$/;
export function getSize(src: SizeString): Size {
    const [_, sizeValue, postfix] = src.match(getSizeRegex) || [];
    if (!_) throw new Error(`Invalid size '${src}'`);

    return {
        type: postfix as Postfixes,
        value: parseFloat(sizeValue)
    };
}

export function getSize2(x: SizeString, y: SizeString) {
    return {
        x: getSize(x),
        y: getSize(y)
    };
}

export function sizeToVal(src: Size, max: number) {
    switch (src.type) {
        case "px":
            return src.value;
        case "%":
            return max * (src.value / 100);
        default:
            throw new Error(`Invalid size postfix, ${src.type}`);
    }
}

export function sizeToVec(src: Size2, max: Vector2) {
    return new Vector2(
        sizeToVal(src.x, max.x),
        sizeToVal(src.y, max.y)
    );
}
