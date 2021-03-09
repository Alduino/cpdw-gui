export const bindableSymbol = Symbol("Bindable");

export default interface Bindable {
    [bindableSymbol]: true;

    bind(): void;
    unbind(): void;
}

export function isBindable(val: any): val is Bindable {
    return !!val[bindableSymbol];
}
