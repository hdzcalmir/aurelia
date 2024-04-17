/**
 * TODO: add description.
 * References:
 * - https://github.com/tc39/proposal-decorator-metadata
 * - https://github.com/microsoft/TypeScript/issues/55788
 */
export declare function initializeTC39Metadata(): void;
/**
 * Determine whether a value is an object.
 *
 * Uses `typeof` to guarantee this works cross-realm, which is where `instanceof Object` might fail.
 *
 * Some environments where these issues are known to arise:
 * - same-origin iframes (accessing the other realm via `window.top`)
 * - `jest`.
 *
 * The exact test is:
 * ```ts
 * typeof value === 'object' && value !== null || typeof value === 'function'
 * ```
 *
 * @param value - The value to test.
 * @returns `true` if the value is an object, otherwise `false`.
 * Also performs a type assertion that defaults to `value is Object | Function` which, if the input type is a union with an object type, will infer the correct type.
 * This can be overridden with the generic type argument.
 *
 * @example
 *
 * ```ts
 * class Foo {
 *   bar = 42;
 * }
 *
 * function doStuff(input?: Foo | null) {
 *   input.bar; // Object is possibly 'null' or 'undefined'
 *
 *   // input has an object type in its union (Foo) so that type will be extracted for the 'true' condition
 *   if (isObject(input)) {
 *     input.bar; // OK (input is now typed as Foo)
 *   }
 * }
 *
 * function doOtherStuff(input: unknown) {
 *   input.bar; // Object is of type 'unknown'
 *
 *   // input is 'unknown' so there is no union type to match and it will default to 'Object | Function'
 *   if (isObject(input)) {
 *     input.bar; // Property 'bar' does not exist on type 'Object | Function'
 *   }
 *
 *   // if we know for sure that, if input is an object, it must be a specific type, we can explicitly tell the function to assert that for us
 *   if (isObject<Foo>(input)) {
 *    input.bar; // OK (input is now typed as Foo)
 *   }
 * }
 * ```
 */
export declare function isObject<T extends object = Object | Function>(value: unknown): value is T;
/**
 * Determine whether a value is `null` or `undefined`.
 *
 * @param value - The value to test.
 * @returns `true` if the value is `null` or `undefined`, otherwise `false`.
 * Also performs a type assertion that ensures TypeScript treats the value appropriately in the `if` and `else` branches after this check.
 */
export declare function isNullOrUndefined(value: unknown): value is null | undefined;
export declare const Metadata: {
    get<T>(key: string, type: any): T | undefined;
    define(value: any, type: any, ...keys: string[]): void;
    has(key: string, type: any): boolean;
    delete(key: string, type: any): void;
};
//# sourceMappingURL=index.d.ts.map