import { Class } from '@aurelia/kernel';
import { type BindingMode } from './binding/interfaces-bindings';
import type { Constructable } from '@aurelia/kernel';
import type { InterceptorFunc } from '@aurelia/runtime';
type PropertyType = typeof Number | typeof String | typeof Boolean | typeof BigInt | {
    coercer: InterceptorFunc;
} | Class<unknown>;
export type PartialBindableDefinition = {
    mode?: BindingMode;
    callback?: string;
    attribute?: string;
    name?: string;
    primary?: boolean;
    set?: InterceptorFunc;
    type?: PropertyType;
    /**
     * When set to `false` and automatic type-coercion is enabled, `null` and `undefined` will be coerced into target type.
     *
     * @default true
     */
    nullable?: boolean;
};
type PartialBindableDefinitionPropertyOmitted = Omit<PartialBindableDefinition, 'name'>;
/**
 * Decorator: Specifies custom behavior for a bindable property.
 *
 * @param config - The overrides
 */
export declare function bindable(config?: PartialBindableDefinitionPropertyOmitted): (target: {}, property: string) => void;
/**
 * Decorator: Specifies a bindable property on a class.
 *
 * @param prop - The property name
 */
export declare function bindable(prop: string): (target: Constructable) => void;
/**
 * Decorator: Specifies a bindable property on a class.
 *
 * @param target - The class
 * @param prop - The property name
 */
export declare function bindable(target: {}, prop: string): void;
export declare const Bindable: Readonly<{
    name: string;
    keyFrom: (name: string) => string;
    from(type: Constructable, ...bindableLists: readonly (BindableDefinition | Record<string, PartialBindableDefinition> | readonly string[] | undefined)[]): Record<string, BindableDefinition>;
    getAll(Type: Constructable): readonly BindableDefinition[];
}>;
export declare class BindableDefinition {
    readonly attribute: string;
    readonly callback: string;
    readonly mode: BindingMode;
    readonly primary: boolean;
    readonly name: string;
    readonly set: InterceptorFunc;
    private constructor();
    static create(prop: string, target: Constructable<unknown>, def?: PartialBindableDefinition): BindableDefinition;
}
export declare function coercer(target: Constructable<unknown>, property: string, _descriptor: PropertyDescriptor): void;
export {};
//# sourceMappingURL=bindable.d.ts.map