import { Key, IResolver } from '@aurelia/kernel';
/**
 * Create a resolver for a given key that will only resolve from the nearest hydration context.
 */
export declare const fromHydrationContext: <T extends Key>(key: T) => IResolver<T | undefined>;
//# sourceMappingURL=resolvers.d.ts.map