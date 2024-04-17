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
export declare const observable: {
    <TFThis, TValue>(target: undefined, context: ClassFieldDecoratorContext<TFThis, TValue>): FieldInitializer<TFThis, TValue>;
    <TCThis extends Constructable, TFThis_1, TValue_1>(config: IObservableDefinition): (target: TCThis | undefined, context: ClassDecoratorContext<TCThis> | ClassFieldDecoratorContext<TFThis_1, TValue_1>) => void | FieldInitializer<TFThis_1, TValue_1>;
    <TCThis_1 extends Constructable>(key: PropertyKey): ObservableClassDecorator<TCThis_1>;
    <TFThis_2, TValue_2>(): ObservableFieldDecorator<TFThis_2, TValue_2>;
};
export {};
//# sourceMappingURL=observable.d.ts.map