export function canHandleTransformChange(obj: any): obj is CanHandleTransformChange {
    if (!obj) return false;
    const method = obj.handleTransformChanged;
    return typeof method === "function";
}

export default interface CanHandleTransformChange {
    handleTransformChanged(): void;
}
