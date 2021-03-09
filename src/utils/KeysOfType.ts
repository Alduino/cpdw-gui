type KeysOfType<TSource, TType> = {
    [key in keyof TSource]: TSource[key] extends TType ? key : never;
}[keyof TSource];

export default KeysOfType;
