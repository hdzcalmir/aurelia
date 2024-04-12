import { ITemplateCompiler } from '../renderer';
import { BindableDefinition } from '../bindable';
import { AttrSyntax } from '../resources/attribute-pattern';
import { CustomElementDefinition } from '../resources/custom-element';
import { BindingCommandInstance } from '../resources/binding-command';
import type { IContainer, Constructable } from '@aurelia/kernel';
import type { CustomAttributeDefinition } from '../resources/custom-attribute';
import type { ICompliationInstruction, IInstruction } from '../renderer';
export declare class TemplateCompiler implements ITemplateCompiler {
    static register(container: IContainer): void;
    debug: boolean;
    resolveResources: boolean;
    compile(definition: CustomElementDefinition, container: IContainer, compilationInstruction: ICompliationInstruction | null): CustomElementDefinition;
    compileSpread(requestor: CustomElementDefinition, attrSyntaxs: AttrSyntax[], container: IContainer, target: Element, targetDef?: CustomElementDefinition): IInstruction[];
}
export interface IAttributeBindablesInfo {
    readonly attrs: Record<string, BindableDefinition>;
    readonly bindables: Record<string, BindableDefinition>;
    readonly primary: BindableDefinition;
}
export interface IElementBindablesInfo {
    readonly attrs: Record<string, BindableDefinition>;
    readonly bindables: Record<string, BindableDefinition>;
    readonly primary: null;
}
export interface IBindablesInfoResolver {
    get(def: CustomAttributeDefinition): IAttributeBindablesInfo;
    get(def: CustomElementDefinition): IElementBindablesInfo;
}
export declare const IBindablesInfoResolver: import("@aurelia/kernel").InterfaceSymbol<IBindablesInfoResolver>;
export interface IResourceResolver {
    el(c: IContainer, name: string): CustomElementDefinition | null;
    attr(c: IContainer, name: string): CustomAttributeDefinition | null;
    command(c: IContainer, name: string): BindingCommandInstance | null;
}
export declare const IResourceResolver: import("@aurelia/kernel").InterfaceSymbol<IResourceResolver>;
/**
 * An interface describing the hooks a compilation process should invoke.
 *
 * A feature available to the default template compiler.
 */
export declare const ITemplateCompilerHooks: import("@aurelia/kernel").InterfaceSymbol<ITemplateCompilerHooks>;
export interface ITemplateCompilerHooks {
    /**
     * Should be invoked immediately before a template gets compiled
     */
    compiling?(template: HTMLElement): void;
}
export declare const TemplateCompilerHooks: Readonly<{
    name: string;
    define<K extends ITemplateCompilerHooks, T extends Constructable<K>>(Type: T): T;
    findAll(container: IContainer): readonly ITemplateCompilerHooks[];
}>;
/**
 * Decorator: Indicates that the decorated class is a template compiler hooks.
 *
 * An instance of this class will be created and appropriate compilation hooks will be invoked
 * at different phases of the default compiler.
 */
export declare const templateCompilerHooks: <T extends Constructable>(target?: T) => any;
//# sourceMappingURL=template-compiler.d.ts.map