import { Constructable, PartialResourceDefinition } from '@aurelia/kernel';
export interface IResourceKind {
    readonly name: string;
    keyFrom(name: string): string;
}
export declare const getDefinitionFromStaticAu: <Def extends {
    readonly key: string;
    readonly name: string;
    readonly Type: import("@aurelia/kernel").ResourceType<Constructable, {}, {}, object>;
    readonly aliases?: readonly string[] | undefined;
    register(container: import("@aurelia/kernel").IContainer, aliasName?: string | undefined): void;
}, C extends Constructable = Constructable>(Type: C | Function, typeName: string, createDef: (au: PartialResourceDefinition<Def>, Type: C) => Def) => Def;
//# sourceMappingURL=resources-shared.d.ts.map