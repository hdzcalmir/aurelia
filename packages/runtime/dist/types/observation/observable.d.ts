import { AccessorType, IAccessor, ISubscriberCollection } from '../observation';
import { type Constructable } from '@aurelia/kernel';
import type { InterceptorFunc } from '../observation';
export interface IObservableDefinition {
    name?: PropertyKey;
    callback?: PropertyKey;
    set?: InterceptorFunc;
}
type FieldInitializer<TFThis, TValue> = (this: TFThis, initialValue: TValue) => TValue;
type ObservableFieldDecorator<TFThis, TValue> = (target: undefined, context: ClassFieldDecoratorContext<TFThis, TValue>) => FieldInitializer<TFThis, TValue>;
type ObservableClassDecorator<TCThis extends Constructable> = (target: TCThis, context: ClassDecoratorContext<TCThis>) => void;
export declare function observable<TFThis, TValue>(target: undefined, context: ClassFieldDecoratorContext<TFThis, TValue>): FieldInitializer<TFThis, TValue>;
export declare function observable<TCThis extends Constructable, TFThis, TValue>(config: IObservableDefinition): (target: TCThis | undefined, context: ClassDecoratorContext<TCThis> | ClassFieldDecoratorContext<TFThis, TValue>) => FieldInitializer<TFThis, TValue> | void;
export declare function observable<TCThis extends Constructable>(key: PropertyKey): ObservableClassDecorator<TCThis>;
export declare function observable<TFThis, TValue>(): ObservableFieldDecorator<TFThis, TValue>;
export interface SetterNotifier extends IAccessor, ISubscriberCollection {
}
export declare class SetterNotifier implements IAccessor {
    static mixed: boolean;
    readonly type: AccessorType;
    constructor(obj: object, callbackKey: PropertyKey, set: InterceptorFunc | undefined, initialValue: unknown);
    getValue(): unknown;
    setValue(value: unknown): void;
}
export {};
//# sourceMappingURL=observable.d.ts.map