import type { ICollectionSubscriber, ISubscriber } from './interfaces';
import { Constructable } from '@aurelia/kernel';
export type IAnySubscriber = ISubscriber | ICollectionSubscriber;
export declare const subscriberCollection: {
    (): <T extends Constructable>(value: T, context: ClassDecoratorContext) => T;
    <T_1 extends Constructable>(target: T_1, context: ClassDecoratorContext): T_1;
};
//# sourceMappingURL=subscriber-collection.d.ts.map