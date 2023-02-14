import { Class } from '@aurelia/kernel';
import { BindingMode } from './binding/interfaces-bindings';
import type { Constructable } from '@aurelia/kernel';
import type { InterceptorFunc } from '@aurelia/runtime';
type PropertyType = typeof Number | typeof String | typeof Boolean | typeof BigInt | {
    coercer: InterceptorFunc;
} | Class<unknown>;
export type PartialBindableDefinition = {
    mode?: BindingMode;
    callback?: string;
    attribute?: string;
    property?: string;
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
type PartialBindableDefinitionPropertyRequired = PartialBindableDefinition & {
    property: string;
};
type PartialBindableDefinitionPropertyOmitted = Omit<PartialBindableDefinition, 'property'>;
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
type BFluent = {
    add(config: PartialBindableDefinitionPropertyRequired): BFluent;
    add(property: string): BFluent & B12345;
};
type B1<T = {}> = {
    mode(mode: BindingMode): BFluent & T;
};
type B2<T = {}> = {
    callback(callback: string): BFluent & T;
};
type B3<T = {}> = {
    attribute(attribute: string): BFluent & T;
};
type B4<T = {}> = {
    primary(): BFluent & T;
};
type B5<T = {}> = {
    set(setterFn: InterceptorFunc): BFluent & T;
};
type B45 = B5 & B4<B5>;
type B345 = B45 & B3<B45>;
type B2345 = B345 & B2<B345>;
type B12345 = B2345 & B1<B2345>;
export declare const Bindable: Readonly<{
    name: string;
    keyFrom: (name: string) => string;
    from(type: Constructable, ...bindableLists: readonly (BindableDefinition | Record<string, PartialBindableDefinition> | readonly string[] | undefined)[]): Record<string, BindableDefinition>;
    for(Type: Constructable): BFluent;
    getAll(Type: Constructable): readonly BindableDefinition[];
}>;
export declare class BindableDefinition {
    readonly attribute: string;
    readonly callback: string;
    readonly mode: BindingMode;
    readonly primary: boolean;
    readonly property: string;
    readonly set: InterceptorFunc;
    private constructor();
    static create(prop: string, target: Constructable<unknown>, def?: PartialBindableDefinition): BindableDefinition;
}
export declare function coercer(target: Constructable<unknown>, property: string, _descriptor: PropertyDescriptor): void;
export {};
//# sourceMappingURL=bindable.d.ts.map