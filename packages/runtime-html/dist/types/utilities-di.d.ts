import { type IResolver, type Key, type Constructable, type IContainer, type IResourceKind, type ResourceDefinition, type IAllResolver } from '@aurelia/kernel';
export declare const resource: <T extends Key>(key: T) => IResolver<T> & ((...args: unknown[]) => any);
/**
 * A resolver builder for resolving all registrations of a key
 * with resource semantic (leaf + root + ignore middle layer container)
 */
export declare const allResources: <T extends Key>(key: T) => IAllResolver<T>;
export declare function alias(...aliases: readonly string[]): (target: Constructable) => void;
export declare function registerAliases(aliases: readonly string[], resource: IResourceKind<Constructable, ResourceDefinition>, key: string, container: IContainer): void;
//# sourceMappingURL=utilities-di.d.ts.map