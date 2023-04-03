import type { Constructable } from '@aurelia/kernel';
import type { InterceptorFunc } from '../observation';
export interface IObservableDefinition {
    name?: PropertyKey;
    callback?: PropertyKey;
    set?: InterceptorFunc;
}
export declare function observable(target: object, key: PropertyKey, descriptor?: PropertyDescriptor & {
    initializer?: () => unknown;
}): void;
export declare function observable(config: IObservableDefinition): (target: Constructable | object, ...args: unknown[]) => void;
export declare function observable(key: PropertyKey): ClassDecorator;
export declare function observable(): PropertyDecorator;
//# sourceMappingURL=observable.d.ts.map