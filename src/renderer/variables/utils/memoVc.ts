import {VariableCreator} from "../../Variable";

export default function memoVc<T>(creatorFn: Function, name: string, creator: VariableCreator<T>): VariableCreator<T> {
    const key = creatorFn.name + "||" + name;
    return (ctx, cache) => {
        if (cache.has(key)) return cache.get(key);

        const variable = creator(ctx, cache);
        cache.set(key, variable);
        return variable;
    };
}
