export enum UniformType {
    f1,
    f2,
    f3,
    f4
}

export default interface Uniform<TParams extends unknown[]> {
    set(...value: TParams): void;
}
