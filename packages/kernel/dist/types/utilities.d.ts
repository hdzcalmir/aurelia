/**
 * Returns true if the value is a Promise via checking if it's an instance of Promise.
 * This does not work for objects across different realms (e.g., iframes).
 * An utility to be shared among core packages for better size optimization
 */
export declare const isPromise: <T>(v: unknown) => v is Promise<T>;
/**
 * Returns true if the value is an Array via checking if it's an instance of Array.
 * This does not work for objects across different realms (e.g., iframes).
 * An utility to be shared among core packages for better size optimization
 */
export declare const isArray: <T>(v: unknown) => v is T[];
/**
 * Returns true if the value is a Set via checking if it's an instance of Set.
 * This does not work for objects across different realms (e.g., iframes).
 * An utility to be shared among core packages for better size optimization
 */
export declare const isSet: <T>(v: unknown) => v is Set<T>;
/**
 * Returns true if the value is a Map via checking if it's an instance of Map.
 * This does not work for objects across different realms (e.g., iframes).
 * An utility to be shared among core packages for better size optimization
 */
export declare const isMap: <T, K>(v: unknown) => v is Map<T, K>;
/**
 * Returns true if the value is an object via checking if it's an instance of Object.
 * This does not work for objects across different realms (e.g., iframes).
 * An utility to be shared among core packages for better size optimization
 */
export declare const isObject: (v: unknown) => v is object;
/**
 * Returns true if the value is a function
 * An utility to be shared among core packages for better size optimization
 */
export declare const isFunction: <T extends Function>(v: unknown) => v is T;
/**
 * Returns true if the value is a string
 * An utility to be shared among core packages for better size optimization
 */
export declare const isString: (v: unknown) => v is string;
/**
 * Returns true if the value is a symbol
 * An utility to be shared among core packages for better size optimization
 */
export declare const isSymbol: (v: unknown) => v is string;
/**
 * Returns true if the value is a number
 * An utility to be shared among core packages for better size optimization
 */
export declare const isNumber: (v: unknown) => v is number;
/**
 * Create an object with no prototype to be used as a record
 * An utility to be shared among core packages for better size optimization
 */
export declare const createLookup: <T>() => Record<string, T>;
/**
 * Compare the 2 values without pitfall of JS ===, including NaN and +0/-0
 * An utility to be shared among core packages for better size optimization
 */
export declare const areEqual: (value1: any, value2: any) => boolean;
export type AnyFunction = (...args: any) => any;
export type FunctionPropNames<T> = {
    [K in keyof T]: K extends 'constructor' ? never : NonNullable<T[K]> extends AnyFunction ? K : never;
}[keyof T];
export type MaybePromise<T> = T | Promise<T>;
//# sourceMappingURL=utilities.d.ts.map