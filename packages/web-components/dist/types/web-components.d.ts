import { IContainer, type Constructable } from '@aurelia/kernel';
import { IPlatform, IRendering, type PartialCustomElementDefinition } from '@aurelia/runtime-html';
export declare const IWcElementRegistry: import("@aurelia/kernel").InterfaceSymbol<IWcElementRegistry>;
export interface IWcElementRegistry {
    /**
     * Define a web-component custom element for a set of given parameters
     *
     * @param name - the name to register with the underlying CustomElementRegistry
     * @param def - the definition of the view model of the underlying web-components custom element.
     *
     * This can be either a plain class, or an object with definition specification like in a normal Aurelia customElement view model configuration
     * @param options - The web-component definition options in the call customElements.define(..., xxx)
     *
     * This is to define extend built-in element etc...
     *
     * @returns the web-component custom element class. This can be used in application to further enhance/spy on its instances
     */
    define(name: string, def: Constructable, options?: ElementDefinitionOptions): Constructable<HTMLElement>;
    define(name: string, def: Omit<PartialCustomElementDefinition, 'name'>, options?: ElementDefinitionOptions): Constructable<HTMLElement>;
}
export declare type WebComponentViewModelClass = Constructable | {
    bindables?: PartialCustomElementDefinition['bindables'];
    watches?: PartialCustomElementDefinition['watches'];
    template?: PartialCustomElementDefinition['template'];
    shadowOptions?: PartialCustomElementDefinition['shadowOptions'];
};
/**
 * A default implementation of `IWcElementRegistry` interface.
 */
export declare class WcCustomElementRegistry implements IWcElementRegistry {
    constructor(ctn: IContainer, p: IPlatform, r: IRendering);
    define(name: string, def: Constructable | Omit<PartialCustomElementDefinition, 'name'>, options?: ElementDefinitionOptions): Constructable<HTMLElement>;
}
//# sourceMappingURL=web-components.d.ts.map