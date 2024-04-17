import { Class } from '@aurelia/kernel';
export type $ClassDecorator = <T extends Class<unknown>>(value: T, context: ClassDecoratorContext) => void | T;
export type $FieldDecorator = (value: undefined, context: ClassFieldDecoratorContext) => ((initialValue: unknown) => unknown) | void;
//# sourceMappingURL=utilities.d.ts.map