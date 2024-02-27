import { type Key, type IResolver, type Resolved, type IFactoryResolver, type ILazyResolver, type INewInstanceResolver, type IResolvedFactory, type IResolvedLazy, type IAllResolver, type IOptionalResolver } from './di';
export type IResolvedInjection<K extends Key> = K extends IAllResolver<infer R> ? readonly Resolved<R>[] : K extends INewInstanceResolver<infer R> ? Resolved<R> : K extends ILazyResolver<infer R> ? IResolvedLazy<R> : K extends IOptionalResolver<infer R> ? Resolved<R> | undefined : K extends IFactoryResolver<infer R> ? IResolvedFactory<R> : K extends IResolver<infer R> ? Resolved<R> : K extends [infer R1 extends Key, ...infer R2] ? [IResolvedInjection<R1>, ...IResolvedInjection<R2>] : K extends {
    __resolved__: infer T;
} ? T : Resolved<K>;
/**
 * Retrieve the resolved value of a key, or values of a list of keys from the currently active container.
 *
 * Calling this without an active container will result in an error.
 */
export declare function resolve<K extends Key>(key: K): IResolvedInjection<K>;
export declare function resolve<K extends Key[]>(...keys: K): IResolvedInjection<K>;
//# sourceMappingURL=di.container.d.ts.map