/**
 * A decorator for component properties whose values derived from global state
 * Usage example:
 *
 * ```ts
 * class MyComponent {
 *  \@fromState(s => s.items)
 *   data: Item[]
 * }
 * ```
 */
export declare function fromState<T, K = unknown>(getValue: (state: T) => K): PropertyDecorator;
//# sourceMappingURL=state-decorator.d.ts.map