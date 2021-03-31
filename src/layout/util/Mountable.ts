export interface Mountable {
    unmount(): void;
}

export function isMountable(el: any): el is Mountable {
    if (el == null) return false;
    if (typeof el !== "object") return false;
    return typeof el.unmount === "function";
}
